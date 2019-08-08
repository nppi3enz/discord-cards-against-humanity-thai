const Game = require('../../classes/Game');
const { prefix } = getConfig();

module.exports = {
  name: 'start',
  description: 'A start command to start the game! To start a game you need at least 3 players.',
  execute(message, options) {
    const { channel } = message.member.voice;
    if (!channel) {
      message.reply('you need to be in a voice channel to start a game.');
      return;
    }
    if (!channel.joinable) {
      message.reply("I can't join your voice channel!");
      return;
    }
    channel.join();
    const gameObject = new Game(message.member);
    options.games[message.guild.id] = gameObject;
    message.author.send('You have created a game lobby. You are the Gamemaster');
    message.author.send(`To edit game settings use the **${prefix}set** command. To start a game you need at least 3 players.`);
  }
};
