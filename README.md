# Discord Music Bot

A powerful Discord music bot using Riffy and Lavalink with support for both slash commands and prefix commands.

## Features

- 🎵 **High-quality music playback** using Lavalink
- 🎧 **Spotify integration** for seamless playlist support
- ⚡ **Slash commands** for modern Discord experience
- 🔧 **Prefix commands** for backward compatibility
- 📋 **Queue management** with shuffle, loop, and more
- 🎚️ **Volume control** and player status
- 🎨 **Beautiful embeds** with track information

## Commands

### Slash Commands (Recommended)
Use `/` to access these commands:

#### Playback Commands
- `/play <query>` - Play a song or playlist
- `/pause` - Pause the current track
- `/resume` - Resume the current track
- `/skip` - Skip the current track
- `/stop` - Stop playback and clear queue

#### Queue Management
- `/queue` - Show the current queue
- `/nowplaying` - Show current track info
- `/shuffle` - Shuffle the current queue
- `/loop` - Toggle queue loop mode
- `/remove <position>` - Remove a track from queue
- `/clear` - Clear the current queue

#### Player Controls
- `/volume <0-100>` - Adjust player volume
- `/status` - Show player status
- `/help` - Show help information

### Prefix Commands (Legacy)
Use `!` prefix for these commands (same functionality as slash commands):
- `!play <query>`
- `!pause`
- `!resume`
- `!skip`
- `!stop`
- `!queue`
- `!nowplaying`
- `!volume <0-100>`
- `!shuffle`
- `!loop`
- `!remove <position>`
- `!clear`
- `!status`
- `!help`

## Setup

### Prerequisites
- Node.js 16.9.0 or higher
- A Discord bot token
- A Lavalink server
- Spotify API credentials (optional but recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd music-bot-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure the bot**
   Edit `config.js` with your credentials:
   ```javascript
   module.exports = {
       prefix: '!',
       clientId: 'YOUR_BOT_CLIENT_ID',
       nodes: [{
           host: "YOUR_LAVALINK_HOST",
           password: "YOUR_LAVALINK_PASSWORD",
           port: 443,
           secure: true,
           name: "Main Node"
       }],
       spotify: {
           clientId: "YOUR_SPOTIFY_CLIENT_ID",
           clientSecret: "YOUR_SPOTIFY_CLIENT_SECRET"
       },
       botToken: "YOUR_DISCORD_BOT_TOKEN",
       embedColor: "#0061ff"
   };
   ```

4. **Deploy slash commands**
   ```bash
   npm run deploy-commands
   ```

5. **Start the bot**
   ```bash
   npm start
   ```

## Configuration

### Required Permissions
Your bot needs the following permissions:
- Send Messages
- Embed Links
- Connect
- Speak
- Use Slash Commands

### Bot Permissions
Make sure your bot has these scopes when creating the invite link:
- `bot`
- `applications.commands`

## Usage

1. **Invite the bot** to your server with proper permissions
2. **Join a voice channel**
3. **Use slash commands** like `/play <song name>` to start playing music
4. **Manage the queue** with commands like `/queue`, `/skip`, `/shuffle`

## Features in Detail

### Music Sources
- YouTube Music (default)
- YouTube
- Spotify (playlists and tracks)
- Direct URLs

### Queue Features
- Add multiple tracks
- Shuffle queue
- Loop entire queue
- Remove specific tracks
- Clear entire queue

### Player Controls
- Volume adjustment (0-100%)
- Pause/Resume
- Skip tracks
- Player status display

## Troubleshooting

### Common Issues

1. **Bot not responding to slash commands**
   - Make sure you ran `npm run deploy-commands`
   - Check that the bot has the `applications.commands` scope
   - Verify the `clientId` in config.js is correct

2. **Music not playing**
   - Ensure you're in a voice channel
   - Check Lavalink server connection
   - Verify bot has voice permissions

3. **Spotify not working**
   - Check Spotify API credentials
   - Ensure `riffy-spotify` plugin is properly configured

### Support
If you encounter issues:
1. Check the console for error messages
2. Verify all configuration values
3. Ensure all dependencies are installed
4. Check Discord bot permissions

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Credits

- Built with [Discord.js](https://discord.js.org/)
- Music powered by [Riffy](https://github.com/parasop/riffy)
- Lavalink for high-quality audio streaming
- Spotify integration for enhanced music discovery
