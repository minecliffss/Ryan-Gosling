const { Client, GatewayDispatchEvents, Events, InteractionType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { Riffy } = require("riffy");
const { Spotify } = require("riffy-spotify");
const config = require("./config.js");
const messages = require("./utils/messages.js");
const emojis = require("./emojis.js");

const client = new Client({
    intents: [
        "Guilds",
        "GuildMessages",
        "GuildVoiceStates",
        "GuildMessageReactions",
        "MessageContent",
        "DirectMessages",
    ],
});

const spotify = new Spotify({
    clientId: config.spotify.clientId,
    clientSecret: config.spotify.clientSecret
});

client.riffy = new Riffy(client, config.nodes, {
    send: (payload) => {
        const guild = client.guilds.cache.get(payload.d.guild_id);
        if (guild) guild.shard.send(payload);
    },
    defaultSearchPlatform: "ytmsearch",
    restVersion: "v4",
    plugins: [spotify]
});

// Function to create the player control buttons
function createPlayerControls(player) {
    const isPaused = player.paused;

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(isPaused ? 'resume_button' : 'pause_button')
                .setEmoji(isPaused ? emojis.play : emojis.pause)
                .setStyle(isPaused ? ButtonStyle.Success : ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('skip_button')
                .setEmoji(emojis.skip)
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('stop_button')
                .setEmoji(emojis.stop)
                .setStyle(ButtonStyle.Danger)
        );

    return row;
}

client.on("ready", () => {
    client.riffy.init(client.user.id);
    console.log(`${emojis.success} Logged in as ${client.user.tag}`);
    console.log(`${emojis.info} Bot is ready! Use /help for commands.`);
});

// Slash command and Button handler
client.on(Events.InteractionCreate, async (interaction) => {
    // Button Interaction Handler
    if (interaction.isButton()) {
        const player = client.riffy.players.get(interaction.guild.id);
        if (!player) {
            return interaction.reply({ content: `${emojis.error} The music has already been stopped.`, ephemeral: true });
        }

        if (!interaction.member.voice.channel || interaction.member.voice.channel.id !== player.voiceChannel) {
             return interaction.reply({ content: `${emojis.error} You need to be in the same voice channel as the bot to use these buttons.`, ephemeral: true });
        }

        switch (interaction.customId) {
            case 'pause_button':
                player.pause(true);
                await interaction.update({ components: [createPlayerControls(player)] });
                break;
            case 'resume_button':
                player.pause(false);
                 await interaction.update({ components: [createPlayerControls(player)] });
                break;
            case 'skip_button':
                if (!player.queue.length) {
                    await interaction.message.delete().catch(console.error);
                    return interaction.reply({ content: `${emojis.error} There are no more songs to skip to.`, ephemeral: true });
                }
                player.stop();
                await interaction.deferUpdate();
                break;
            case 'stop_button':
                if (player.nowPlayingMessage) {
                   await player.nowPlayingMessage.delete().catch(console.error);
                }
                player.destroy();
                await interaction.reply({ content: `${emojis.stop} The music has been stopped and the queue cleared.`, ephemeral: true });
                break;
        }

        return;
    }

    // Slash Command Handler
    if (interaction.type !== InteractionType.ApplicationCommand) return;

    const { commandName } = interaction;

    const musicCommands = ["play", "skip", "stop", "pause", "resume", "queue", "nowplaying", "volume", "shuffle", "loop", "remove", "clear"];
    if (musicCommands.includes(commandName)) {
        if (!interaction.member.voice.channel) {
            return interaction.reply({
                content: `${emojis.error} You must be in a voice channel to use music commands!`,
                ephemeral: true
            });
        }
    }

    try {
        switch (commandName) {
            case "play": {
                const query = interaction.options.getString('query');
                if (!query) {
                    return interaction.reply({ content: `${emojis.error} Please provide a search query!`, ephemeral: true });
                }

                await interaction.deferReply();

                const player = client.riffy.createConnection({
                    guildId: interaction.guild.id,
                    voiceChannel: interaction.member.voice.channel.id,
                    textChannel: interaction.channel.id,
                    deaf: true,
                });

                const resolve = await client.riffy.resolve({ query: query, requester: interaction.user });
                const { loadType, tracks, playlistInfo } = resolve;

                if (loadType === "playlist") {
                    for (const track of resolve.tracks) {
                        track.info.requester = interaction.user;
                        player.queue.add(track);
                    }
                    await interaction.editReply({ content: `${emojis.success} Added playlist **${playlistInfo.name}** with **${tracks.length}** songs to the queue.` });
                    if (!player.playing && !player.paused) player.play();

                } else if (loadType === "search" || loadType === "track") {
                    const track = tracks.shift();
                    track.info.requester = interaction.user;
                    player.queue.add(track);
                    await interaction.editReply({ content: `${emojis.success} Added **${track.info.title}** to the queue.` });
                    if (!player.playing && !player.paused) player.play();

                } else {
                    return interaction.editReply({ content: `${emojis.error} No results found!` });
                }
                break;
            }

            case "nowplaying": {
                const player = client.riffy.players.get(interaction.guild.id);
                if (!player || !player.queue.current) return interaction.reply({ content: `${emojis.error} Nothing is playing!`, ephemeral: true });

                const embed = messages.nowPlaying(null, player.queue.current).embeds[0]; // Adapt for slash command
                const controls = createPlayerControls(player);
                await interaction.reply({ embeds: [embed], components: [controls] });
                break;
            }
        }
    } catch (error) {
        console.error(error);
        if (interaction.deferred || interaction.replied) {
            await interaction.followUp({ content: `${emojis.error} An error occurred while executing this command!`, ephemeral: true });
        } else {
            await interaction.reply({ content: `${emojis.error} An error occurred while executing this command!`, ephemeral: true });
        }
    }
});


client.riffy.on("nodeConnect", (node) => {
    console.log(`${emojis.success} Node "${node.name}" connected.`);
});

client.riffy.on("nodeError", (node, error) => {
    console.log(`${emojis.error} Node "${node.name}" encountered an error: ${error.message}.`);
});

client.riffy.on("trackStart", async (player, track) => {
    console.log("Artwork URL:", track.info.artworkUrl); 
    
    if (player.nowPlayingMessage) {
        await player.nowPlayingMessage.delete().catch(console.error);
    }

    const channel = client.channels.cache.get(player.textChannel);
    if (!channel) return;

    // CORRECTED: Call the correct function name 'messages.nowPlaying'
    const controls = createPlayerControls(player);
    const message = await messages.nowPlaying(channel, track, [controls]);
    player.nowPlayingMessage = message;
});

client.riffy.on("queueEnd", async (player) => {
    if (player.nowPlayingMessage) {
        await player.nowPlayingMessage.delete().catch(console.error);
    }
    const channel = client.channels.cache.get(player.textChannel);
    if(channel) {
        messages.queueEnded(channel);
    }
    player.destroy();
});

client.on("raw", (d) => {
    if (![GatewayDispatchEvents.VoiceStateUpdate, GatewayDispatchEvents.VoiceServerUpdate].includes(d.t)) return;
    client.riffy.updateVoiceState(d);
});

client.login(config.botToken);