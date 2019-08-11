module.exports = {
  name: 'dm',
  description: 'Added this for the sake of keeping the dm folder on git.',
  gamemasterOnly: true,
  requiredGameStatus: null,
  execute(message, options) {
    message.reply('DM!');
  }
};
