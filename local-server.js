import express from 'express';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Dynamically load API routes from the /api directory
const apiDir = path.join(__dirname, 'api');

async function mountApiRoutes(dir, prefix = '/api') {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            await mountApiRoutes(fullPath, `${prefix}/${file}`);
        } else if (file.endsWith('.js')) {
            const routePath = `${prefix}/${file.slice(0, -3)}`.replace(/\/index$/, '');
            try {
                const fileUrl = pathToFileURL(fullPath).href;
                const module = await import(fileUrl);
                if (module.default) {
                    app.all(routePath, (req, res) => {
                        // Mock Vercel request/response if needed
                        module.default(req, res);
                    });
                    console.log(`Mounted route: ${routePath}`);
                }
            } catch (err) {
                console.error(`Failed to load route ${routePath}:`, err);
            }
        }
    }
}

mountApiRoutes(apiDir).then(() => {
    app.listen(PORT, () => {
        console.log(`Local dev server running at http://localhost:${PORT}`);
    });
});
