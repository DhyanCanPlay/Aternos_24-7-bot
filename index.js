const mineflayer = require('mineflayer');

const HOST = 'vamsikiduniya.aternos.me';
const USERNAME = 'Bot';


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
