// update.js

const axios = require('axios');
const fs = require('fs');
const path = require('path');

const gitHubRawUrl = 'https://raw.githubusercontent.com/ABIR-ISLAM099/ABIR-ISLAM099/main/index.js';
const localFilePath = path.join(__dirname, 'index.js');

const updateProject = async () => {
    try {
        const response = await axios.get(gitHubRawUrl);
        fs.writeFileSync(localFilePath, response.data, 'utf8');
        console.log('Project updated successfully from GitHub.');

        // Optionally, restart the server
        restartServer();
    } catch (error) {
        console.error('Error updating the project:', error);
    }
};

const restartServer = () => {
    const { exec } = require('child_process');
    exec('node index.js', (error) => {
        if (error) {
            console.error(`Error restarting the server: ${error.message}`);
        } else {
            console.log('Server restarted successfully.');
        }
    });
    process.exit(); // Exit the current process
};

// Call the update function
updateProject();
