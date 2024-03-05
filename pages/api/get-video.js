import fs from 'fs';
import path from 'path';
import { Client } from '@microsoft/microsoft-graph-client';
import { v4 as uuidv4 } from 'uuid';

const readVideosData = () => {
    const videosFilePath = path.join(process.cwd(), 'videos.json');
    try {
        const data = fs.readFileSync(videosFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading videos data:', error);
        return [];
    }
};

const writeVideosData = (data) => {
    const videosFilePath = path.join(process.cwd(), 'videos.json');
    try {
        fs.writeFileSync(videosFilePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error('Error writing videos data:', error);
    }
};

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).end();
    }

    const { name, token } = req.query;
    if (!name || !token) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    const videos = readVideosData();
    let videoData = videos.find((v) => v.name === name);

    if (!videoData) {
        const client = Client.init({
            authProvider: (done) => {
                done(null, token);
            },
        });
        try {
            const videoItem = await client.api(`/me/drive/root:/Clips/${name}:/`).select('@microsoft.graph.downloadUrl').get();
            const downloadUrl = videoItem['@microsoft.graph.downloadUrl'];

            const thumbnailResponse = await client.api(`/me/drive/items/${videoItem.id}/thumbnails/0/large`).get();
            const thumbnailUrl = thumbnailResponse.url;

            if (downloadUrl && thumbnailUrl) {
                const uuid = uuidv4();
                videoData = { uuid, name: name, downloadUrl, thumbnailUrl };
                videos.push(videoData);
                writeVideosData(videos);
            } else {
                return res.status(404).send('Failed to retrieve video or thumbnail.');
            }
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).send('Failed to fetch video from OneDrive');
        }
    }

    res.status(200).json(videoData);
}

export const runtime = 'experimental-edge';