import fetch from 'node-fetch';

const LASTFM_API_KEY = process.env.LASTFM_API_KEY;
const LASTFM_API_URL = 'https://ws.audioscrobbler.com/2.0/';

export default async function (req, res) {
    console.log('Received request for Last.fm API test.');
    console.log(`Using Last.fm API Key: ${LASTFM_API_KEY ? 'Configured' : 'NOT CONFIGURED'}`);

    if (!LASTFM_API_KEY) {
        console.error('Last.fm API key is not configured in .env file.');
        return res.status(500).json({ error: 'Last.fm API key not configured.' });
    }

    const testSearchTerm = 'believe';

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
};
