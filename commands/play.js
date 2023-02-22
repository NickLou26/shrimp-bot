const { SlashCommandBuilder } = require('discord.js');
const playDl = require('play-dl');
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
} = require('@discordjs/voice');

const joinVC = (interaction) => {
  return joinVoiceChannel({
    channelId: interaction.member.voice.channel.id,
    guildId: interaction.guildId,
    adapterCreator: interaction.guild.voiceAdapterCreator,
  });
};

const play = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play music')
    .addStringOption((option) =>
      option
        .setName('song-name')
        .setDescription('The name of the song to play')
        .setRequired(true)
    ),
  async execute(interaction, queue) {
    await interaction.deferReply();

    //Check if the user query is a spotify playlist
    const isSpotifyPlaylist =
      interaction.options.getString('song-name').includes('playlist') &&
      interaction.options.getString('song-name').includes('spotify');
    //Check if the user query is an url
    const isUrl = interaction.options.getString('song-name').includes('http');

    if (isUrl && !isSpotifyPlaylist) {
      await interaction.editReply(`Must be song name!`);
    } else {
      //Join voice channel of user
      const voiceConnection = joinVC(interaction);
      //Audio player
      const player = createAudioPlayer();
      //Listener called when state of player changes
      player.addListener('stateChange', (oldOne, newOne) => {
        if (newOne.status == 'idle') {
          queue.shift();
          if (queue.length != 0) {
            player.play(queue[0].resource, { seek: 0, volume: 1.0 });
          }
        }
      });

      //Wip playlist
      // if (isSpotifyPlaylist) {
      //   console.log('in');
      //   const searched = await playDl.search(
      //     interaction.options.getString('song-name'),
      //     { source: { spotify: 'playlist' } }
      //   );
      //   console.log(searched[0]);
      //   console.log(searched);
      // } else {
      //   const searched = await playDl.search(
      //     interaction.options.getString('song-name')
      //   );
      // }

      //Get url of the song
      const searched = await playDl.search(
        interaction.options.getString('song-name')
      );

      //Get stream based on url
      const stream = await playDl.stream(searched[0].url);

      //Create AudioResource from Stream
      const resource = createAudioResource(stream.stream, {
        inputType: stream.type,
      });

      //Add track to queue
      queue.push({
        resource: resource,
        title: searched[0].title,
        query: interaction.options.getString('song-name'),
      });

      if (queue.length === 1) {
        voiceConnection.subscribe(player);
        player.play(queue[0].resource, { seek: 0, volume: 1.0 });
        await interaction.editReply(`Playing ${searched[0].title}!`);
      } else {
        await interaction.editReply(`Added ${searched[0].title} to queue!`);
      }
    }
  },
};

module.exports = play;
