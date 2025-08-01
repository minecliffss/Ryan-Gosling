const { REST, Routes } = require('discord.js');
const config = require('./config.js');

const commands = [
    {
        name: 'play',
        description: 'Play a song or playlist',
        options: [
            {
                name: 'query',
                description: 'The song name, URL, or search query',
                type: 3, // STRING
                required: true
            }
        ]
    },
    {
        name: 'pause',
        description: 'Pause the current track'
    },
    {
        name: 'resume',
        description: 'Resume the current track'
    },
    {
        name: 'skip',
        description: 'Skip the current track'
    },
    {
        name: 'stop',
        description: 'Stop playback and clear queue'
    },
    {
        name: 'queue',
        description: 'Show the current queue'
    },
    {
        name: 'nowplaying',
        description: 'Show current track info'
    },
    {
        name: 'volume',
        description: 'Adjust player volume',
        options: [
            {
                name: 'level',
                description: 'Volume level (0-100)',
                type: 4, // INTEGER
                required: true,
                min_value: 0,
                max_value: 100
            }
        ]
    },
    {
        name: 'shuffle',
        description: 'Shuffle the current queue'
    },
    {
        name: 'loop',
        description: 'Toggle queue loop mode'
    },
    {
        name: 'remove',
        description: 'Remove a track from queue',
        options: [
            {
                name: 'position',
                description: 'Position of the track to remove',
                type: 4, // INTEGER
                required: true,
                min_value: 1
            }
        ]
    },
    {
        name: 'clear',
        description: 'Clear the current queue'
    },
    {
        name: 'status',
        description: 'Show player status'
    },
    {
        name: 'help',
        description: 'Show help information'
    }
];

const rest = new REST({ version: '10' }).setToken(config.botToken);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationCommands(config.clientId),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();