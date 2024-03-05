import fetch from 'node-fetch';

export default async function handler(req, res) {
    const { code } = req.query;
    const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, TENANT_ID } = process.env;

    if (!code) {
        return res.status(400).json({ error: 'Code is required' });
    }

    try {
        const tokenResponse = await fetch(`https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                redirect_uri: REDIRECT_URI,
                code,
                grant_type: 'authorization_code',
            }),
        }).then((response) => response.json());

        res.status(200).json({ accessToken: tokenResponse.access_token });
    } catch (error) {
        console.error('Error fetching access token:', error);
        res.status(500).json({ error: 'Failed to fetch access token' });
    }
}

export const runtime = 'experimental-edge';