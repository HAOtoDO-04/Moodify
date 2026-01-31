import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch'; // Use node-fetch for server-side fetching
const app = express();

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // For parsing application/json

// Request logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

const LASTFM_API_KEY = process.env.LASTFM_API_KEY;
const LASTFM_API_URL = 'http://ws.audioscrobbler.com/2.0/';

app.get('/', (req, res) => {
    res.send('Hello World from server!');
});

app.get('/api/lastfm/track-search', async (req, res) => {
    const { mood } = req.query; // Get mood from query parameters

    console.log(`Received mood from client: ${mood}`);
    console.log(`Using Last.fm API Key: ${LASTFM_API_KEY ? 'Configured' : 'NOT CONFIGURED'}`);

    if (!mood) {
        return res.status(400).json({ error: 'Mood parameter is required.' });
    }

    if (!LASTFM_API_KEY) {
        console.error('Last.fm API key is not configured in .env file.');
        return res.status(500).json({ error: 'Last.fm API key not configured.' });
    }

    // Map mood to a more general search term if needed, or use mood directly
    const searchTerm = mood; // For now, directly use mood as search term

    const params = new URLSearchParams({
        method: 'track.search',
        track: searchTerm,
        api_key: LASTFM_API_KEY,
        format: 'xml' // Request XML format
    });

    const lastfmApiUrl = `${LASTFM_API_URL}?${params.toString()}`;
    console.log(`Making request to Last.fm API: ${lastfmApiUrl}`);

    try {
        const response = await fetch(lastfmApiUrl);
        console.log(`Last.fm API response status: ${response.status}`);
        if (!response.ok) {
            const errorData = await response.text();
            console.error(`Last.fm API error response: ${errorData}`);
            throw new Error(`Last.fm API responded with status: ${response.status}, message: ${errorData}`);
        }
        const data = await response.text(); // Get response as text (XML)
        res.set('Content-Type', 'application/xml'); // Set content type to XML
        res.send(data);
    } catch (error) {
        console.error('Error fetching from Last.fm API:', error);
        res.status(500).json({ error: 'Failed to fetch music from Last.fm.' });
    }
});

// New test endpoint for Last.fm API connectivity
app.get('/api/lastfm/test', async (req, res) => {
    console.log('Received request for Last.fm API test.');
    console.log(`Using Last.fm API Key: ${LASTFM_API_KEY ? 'Configured' : 'NOT CONFIGURED'}`);

    if (!LASTFM_API_KEY) {
        console.error('Last.fm API key is not configured in .env file.');
        return res.status(500).json({ error: 'Last.fm API key not configured.' });
    }

    const testSearchTerm = 'believe'; // A generic term to test the API

    const params = new URLSearchParams({
        method: 'track.search',
        track: testSearchTerm,
        api_key: LASTFM_API_KEY,
        format: 'xml'
    });

    const lastfmApiUrl = `${LASTFM_API_URL}?${params.toString()}`;
    console.log(`Making test request to Last.fm API: ${lastfmApiUrl}`);

    try {
        const response = await fetch(lastfmApiUrl);
        console.log(`Last.fm API test response status: ${response.status}`);
        if (!response.ok) {
            const errorData = await response.text();
            console.error(`Last.fm API test error response: ${errorData}`);
            throw new Error(`Last.fm API responded with status: ${response.status}, message: ${errorData}`);
        }
        const data = await response.text();
        res.set('Content-Type', 'application/xml');
        res.send(data);
    } catch (error) {
        console.error('Error fetching from Last.fm API during test:', error);
        res.status(500).json({ error: 'Failed to fetch music from Last.fm during test.' });
    }
});

export default app;
