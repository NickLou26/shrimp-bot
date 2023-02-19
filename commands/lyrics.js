const { SlashCommandBuilder } = require('discord.js');
const Genius = require('genius-lyrics');
const Client = new Genius.Client();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lyrics')
    .setDescription('Shows lyrics of current song'),
  async execute(interaction, history) {
    await interaction.deferReply();
    const searches = await Client.songs.search(history[0]);
    const lyrics = await searches[0].lyrics();

    await interaction.editReply(lyrics);
  },
};
