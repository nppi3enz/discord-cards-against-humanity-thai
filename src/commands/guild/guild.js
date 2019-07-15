module.exports = {
  name: 'guild',
  description: 'A sample ping command. Should only work in guilds.',
  execute(message, options) {
    message.reply('Guild!');
  }
};
