module.exports = {
  name: 'ping',
  description: 'A sample ping command.',
  execute(message, options) {
    message.reply('Pong!');
  }
}