module.exports = {
  name: 'dm',
  description: 'A sample ping command. Should only work in DM.',
  execute(message, options) {
    logger.debug(message.author.game);
    message.reply('DM!');
  }
};
