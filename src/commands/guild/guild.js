module.exports = {
  name: 'guild',
  description: 'A sample ping command. Should only work in guilds.',
  execute(message, options) {
    logger.debug(message.guild.game);
    message.reply('Guild!');
  }
};
