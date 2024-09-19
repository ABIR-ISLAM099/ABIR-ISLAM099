// index.js

const express = require('express');
const { alldown } = require('nayan-media-downloader');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/download', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        const data = await alldown(url);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to download media' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
