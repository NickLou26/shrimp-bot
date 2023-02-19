const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('surprise')
    .setDescription('Replies with a surprise!'),
  async execute(interaction, history) {
    await interaction.reply('Penis!');
  },
};
