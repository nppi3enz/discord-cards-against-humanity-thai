module.exports = {
  name: 'common',
  description: 'A sample ping command. Should work in guilds and DM.',
  execute(message, options) {
    message.reply('Common!');
  }
};
