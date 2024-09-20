const express = require('express');
const { alldown } = require('nayan-media-downloader');
const fetch = require('node-fetch');
const { exec } = require('child_process');
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

// Function to check for updates
async function checkForUpdates() {
    try {
        const response = await fetch('https://api.github.com/repos/YOUR_USERNAME/YOUR_REPO/releases/latest');
        const latestRelease = await response.json();
        return latestRelease;
    } catch (error) {
        console.error('Error fetching updates:', error);
    }
}

// Function to update the application
function updateApp() {
    exec('git pull origin main', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error pulling updates: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Error: ${stderr}`);
            return;
        }
        console.log(`Update output: ${stdout}`);
    });
}

// API endpoint to download media
app.post('/download', async (req, res) => {
    const { url } = req.body;

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

// API endpoint to check for updates
app.get('/update', async (req, res) => {
    const latestRelease = await checkForUpdates();
    if (latestRelease) {
        res.json({
            version: latestRelease.tag_name,
            name: latestRelease.name,
            body: latestRelease.body,
            url: latestRelease.html_url
        });
    } else {
        res.status(500).json({ error: 'Could not check for updates' });
    }
});

// Route to trigger update
app.post('/update', (req, res) => {
    updateApp();
    res.json({ message: 'Updating application...' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
