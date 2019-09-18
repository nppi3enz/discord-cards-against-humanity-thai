const Game = require('../../classes/Game');
const { prefix } = getConfig();

module.exports = {
  name: 'play',
  description: 'Creates a new game. Only the gamemaster can start the game with at least 3 players.',
  gamemasterOnly: false,
  requiredGameStatus: null,
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

    if (message.guild.game) {
      message.reply("there's already a game on-going!");
      return;
    }

    if (message.author.game) {
      message.reply("you're already in a game!");
      return;
    }

    channel.join()
      .then(() => {
        const game = new Game(message.member);
        game.gamemaster.member.send('You have created a game lobby. You are the Gamemaster.');
        game.gamemaster.member.send(`To edit the game settings use the **${prefix}set** command. To start a game you need at least 3 players.`);
      })
      .catch(error => {
        throw error;
      });
  }
};
