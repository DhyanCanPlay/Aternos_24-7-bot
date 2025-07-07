const mineflayer = require('mineflayer');
const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('<h1>hi</h1>');
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});


const HOST = 'vamsikiduniya.aternos.me';
const USERNAME = 'ChomuBot';


let bot;

function createBot() {
    bot = mineflayer.createBot({
        host: HOST,
        username: USERNAME,
        auth: 'offline',
    });

    bot.on('spawn', () => {
        console.log('Bot has spawned.');
    });

    bot.on('death', () => {
        console.log('Bot has died. Respawning...');
        // The 'end' event will trigger, and the respawn logic is handled there.
    });

    bot.on('kicked', (reason) => {
        console.log('Bot was kicked from the server for:', reason);
    });

    bot.on('error', (err) => {
        console.error('Bot encountered an error:', err);
    });

    bot.on('end', (reason) => {
        console.log(`Bot disconnected: ${reason}. Reconnecting in 15 seconds...`);
        setTimeout(createBot, 15000); // Attempt to reconnect after 15 seconds
    });

}

// Setup Express Server

// Start the bot
createBot();



const keepAliveURL = 'https://dhyancanplay.onrender.com/';

setInterval(() => {
    axios.head(keepAliveURL)
        .then(response => {
            console.log(`HEAD request to ${keepAliveURL} was successful.`);
        })
        .catch(error => {
            console.error(`Error sending HEAD request to ${keepAliveURL}:`, error.message);
        });
}, 60000); // every minute