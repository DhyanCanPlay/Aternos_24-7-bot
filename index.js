const mineflayer = require('mineflayer');
const express = require('express');
const { mineflayer: mineflayerViewer } = require('prismarine-viewer')

const app = express();
const port = 3000;

let bot = null;

function createBot() {
    bot = mineflayer.createBot({
        host: 'vamsikiduniya.aternos.me', // Minecraft server IP
        port: 25565,                     // Minecraft server port
        username: 'Bot',                 // Minecraft username
        auth: "offline",
    });

    bot.on('spawn', () => {
        console.log('Bot has spawned in the game.');
        mineflayerViewer(bot, { port: 3001 });
    });

    bot.on('end', (reason) => {
        console.log(`Bot disconnected: ${reason}`);
        bot = null; // Clear the bot instance
    });

    bot.on('error', err => {
        console.error('Bot encountered an error:', err);
        bot = null; // Clear the bot instance
    });
}

app.get('/join', (req, res) => {
    if (bot) {
        return res.status(400).send('Bot is already running.');
    }
    createBot();
    res.send('Bot is joining the server...');
});

app.get('/leave', (req, res) => {
    if (!bot) {
        return res.status(400).send('Bot is not running.');
    }
    bot.quit();
    res.send('Bot is leaving the server.');
});



app.get('/tp', (req, res) => {
    if (!bot) {
        return res.status(400).send('Bot is not running.');
    }
    const x = 1908;
    const y = 98;
    const z = 644;
    bot.entity.position.x = x;
    bot.entity.position.y = y;
    bot.entity.position.z = z;
    res.send('Bot is attempting to teleport to x:1908, y:98, z:64.');
});



app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
    console.log('Visit http://localhost:3000/join to make the bot join.');
    console.log('Visit http://localhost:3000/leave to make the bot leave.');
});