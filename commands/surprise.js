const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('surprise')
    .setDescription('Replies with a surprise!'),
  async execute(interaction, queue) {
    await interaction.reply('Penis!');
  },
};
