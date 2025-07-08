const mineflayer = require('mineflayer');
const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

let bot = null;
const HOST = 'vamsikiduniya.aternos.me';
const USERNAME = 'ChomuBot';

function createBot() {
    if (bot) return; // Prevent multiple bots
    bot = mineflayer.createBot({
        host: HOST,
        username: USERNAME,
        auth: 'offline',    
        version : '1.21.7', // Specify the Minecraft version
    });

    bot.on('spawn', () => {
        console.log('Bot has spawned.');
    });

    bot.on('death', () => {
        console.log('Bot has died. Respawning...');
    });

    bot.on('kicked', (reason) => {
        console.log('Bot was kicked from the server for:', reason);
    });

    bot.on('error', (err) => {
        console.error('Bot encountered an error:', err);
        if (bot) bot.end();
    });

    bot.on('end', (reason) => {
        console.log(`Bot disconnected: ${reason}.`);
        bot = null;
    });
}

function leaveBot() {
    if (bot) {
        bot.quit('Bot left by user.');
        bot = null;
    }
}

// Serve HTML with buttons
app.get('/', (req, res) => {
    res.send(`
        <h1>hi</h1>
        <button onclick="fetch('/join').then(()=>location.reload())">Join</button>
        <button onclick="fetch('/leave').then(()=>location.reload())">Leave</button>
        <p>Status: <span id="status"></span></p>
        <script>
            fetch('/status').then(r=>r.json()).then(d=>{
                document.getElementById('status').textContent = d.online ? 'Online' : 'Offline';
            });
        </script>
    `);
});

// Join endpoint
app.get('/join', (req, res) => {
    if (!bot) {
        createBot();
        res.send('Bot joining...');
    } else {
        res.send('Bot already online.');
    }
});

// Leave endpoint
app.get('/leave', (req, res) => {
    if (bot) {
        leaveBot();
        res.send('Bot leaving...');
    } else {
        res.send('Bot already offline.');
    }
});

// Status endpoint
app.get('/status', (req, res) => {
    res.json({ online: !!bot });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

// Keep-alive logic
const keepAliveURL = 'https://dhyancanplay.onrender.com/';
setInterval(() => {
    axios.head(keepAliveURL)
        .then(() => {
            console.log(`HEAD request to ${keepAliveURL} was successful.`);
        })
        .catch(error => {
            console.error(`Error sending HEAD request to ${keepAliveURL}:`, error.message);
        });
}, 60000);