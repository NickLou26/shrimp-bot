const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Shows current queue'),
  async execute(interaction, queue) {
    await interaction.deferReply();
    var queueInString = '';
    if (queue.length > 0) {
      console.log(queue);
      for (var i = 0; i < queue.length; i++) {
        queueInString += `${i + 1}. ${queue[i].title} \n`;
      }
      await interaction.editReply(queueInString);
    } else {
      await interaction.editReply('Queue is empty :(');
    }
  },
};
