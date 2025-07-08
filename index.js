const mineflayer = require('mineflayer');
const { pathfinder, Movements } = require('mineflayer-pathfinder');
const { GoalNear } = require('mineflayer-pathfinder').goals;
const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

let bot = null;
const HOST = 'vamsikiduniya.aternos.me';
const USERNAME = 'noobbot'; // Change to your desired bot username
let moveInterval = null;
const RECONNECT_DELAY = 15000; // 15 seconds

function createBot() {
    if (bot) return; // Prevent multiple bots
    console.log(`Attempting to connect to ${HOST} as ${USERNAME}...`);
    bot = mineflayer.createBot({
        host: HOST,
        username: USERNAME,
        auth: 'offline',
        version: '1.20.1'    // Specify the Minecraft version
    });

    // Load the pathfinder plugin
    bot.loadPlugin(pathfinder);

    bot.on('spawn', () => {
        console.log('Bot has spawned.');
        // Setup pathfinding
        const mcData = require('minecraft-data')(bot.version);
        const defaultMove = new Movements(bot, mcData);

        // Move to a random location every 30 seconds
        moveInterval = setInterval(() => {
            const player = bot.players[USERNAME];
            if (!player || !player.entity) return;

            const x = player.entity.position.x + (Math.random() * 20 - 10);
            const z = player.entity.position.z + (Math.random() * 20 - 10);
            const goal = new GoalNear(x, player.entity.position.y, z, 1);
            bot.pathfinder.setMovements(defaultMove);
            bot.pathfinder.setGoal(goal);
            console.log('Moving to a new random location.');
        }, 30000); // 30 seconds
    });

    bot.on('death', () => {
        console.log('Bot has died. Respawning...');
    });

    bot.on('kicked', (reason) => {
        console.log('Bot was kicked from the server for:', reason);
    });

    bot.on('error', (err) => {
        console.error('Bot encountered an error:', err);
    });

    bot.on('end', (reason) => {
        console.log(`Bot disconnected: ${reason}.`);
        if (moveInterval) clearInterval(moveInterval);
        bot = null;
        console.log(`Attempting to reconnect in ${RECONNECT_DELAY / 1000} seconds...`);
        setTimeout(createBot, RECONNECT_DELAY);
    });
}

function leaveBot() {
    if (bot) {
        // Unregister the 'end' listener to prevent auto-reconnect on manual leave
        bot.removeAllListeners('end');
        bot.quit('Bot left by user.');
        if (moveInterval) clearInterval(moveInterval);
        bot = null;
        console.log('Bot has been manually disconnected.');
    }
}
// Serve HTML with buttons
app.get('/', (_req, res) => {
    res.send(`
        <h1>hi</h1>
        <button onclick="fetch('/join').then(()=>location.reload())">Join</button>
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
app.get('/join', (_req, res) => {
    if (!bot) {
        createBot();
        res.send('Bot joining...');
        res.send('Bot joining...');
    } else {
        res.send('Bot already online.');
    }
});
// Leave endpoint
app.get('/leave', (_req, res) => {
    if (bot) {
        leaveBot();
        res.send('Bot leaving...');
        res.send('Bot leaving...');
    } else {
        res.send('Bot already offline.');
    }
});
// Status endpoint
app.get('/status', (_req, res) => {
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