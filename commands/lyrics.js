const { SlashCommandBuilder } = require('discord.js');
const Genius = require('genius-lyrics');
const Client = new Genius.Client();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lyrics')
    .setDescription('Shows lyrics of current song'),
  async execute(interaction, queue) {
    await interaction.deferReply();
    if (queue.length > 0) {
      const searches = await Client.songs.search(queue[0].query);
      const lyrics = await searches[0].lyrics();

      await interaction.editReply(lyrics);
    } else {
      await interaction.editReply('No music playing :(');
    }
  },
};
