module.exports = {
  name: 'dm',
  description: 'A sample ping command. Should only work in DM.',
  execute(message, options) {
    message.reply('DM!');
  }
};
