import fetch from 'node-fetch';

const LASTFM_API_KEY = process.env.LASTFM_API_KEY;
const LASTFM_API_URL = 'https://ws.audioscrobbler.com/2.0/';

export default async function (req, res) {
    const { mood } = req.query;

    console.log(`Received mood from client: ${mood}`);
    console.log(`Using Last.fm API Key: ${LASTFM_API_KEY ? 'Configured' : 'NOT CONFIGURED'}`);

    if (!mood) {
        return res.status(400).json({ error: 'Mood parameter is required.' });
    }

    if (!LASTFM_API_KEY) {
        console.error('Last.fm API key is not configured in .env file.');
        return res.status(500).json({ error: 'Last.fm API key not configured.' });
    }

    const searchTerm = mood;

    const params = new URLSearchParams({
        method: 'tag.getTopTracks',
        tag: searchTerm.toLowerCase(),
        api_key: LASTFM_API_KEY,
        format: 'xml'
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
        const data = await response.text();
        res.set('Content-Type', 'application/xml');
        res.send(data);
    } catch (error) {
        console.error('Error fetching from Last.fm API:', error);
        res.status(500).json({ error: 'Failed to fetch music from Last.fm.' });
    }
};
