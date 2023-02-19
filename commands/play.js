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

const queue = new Array();

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
  async execute(interaction, history) {
    await interaction.deferReply();

    //Join voice channel of user
    const voiceConnection = joinVC(interaction);
    //Audio player
    const player = createAudioPlayer();
    //Listener called when state of player changes
    player.addListener('stateChange', (oldOne, newOne) => {
      if (newOne.status == 'idle') {
        queue.shift();
        history.shift();
        if (queue.length != 0) {
          player.play(queue[0], { seek: 0, volume: 1.0 });
        }
      }
    });

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
    queue.push(resource);
    history.push(interaction.options.getString('song-name'));

    if (queue.length === 1) {
      voiceConnection.subscribe(player);
      player.play(queue[0], { seek: 0, volume: 1.0 });
      await interaction.editReply(`Playing ${searched[0].title}!`);
    } else {
      await interaction.editReply(`Added ${searched[0].title} to queue!`);
    }
  },
};

module.exports = play;
