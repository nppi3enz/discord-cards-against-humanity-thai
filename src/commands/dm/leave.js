const { GAME_STATUS } = require('../../common/constants');

module.exports = {
  name: 'leave',
  description: 'Leave the current game.',
  gamemasterOnly: false,
  requiredGameStatus: GAME_STATUS.any,
  execute(message, options) {
    const { game } = message.author;

    try {
      game.removePlayer(message.author.id);
      message.reply(`You have left the game.`);

      if (game.players.length < 3) {
        game.broadcastToPlayers('Game has less than 3 players.');
        game.end();
        message.author.game = null;
        return;
      }
    } catch (error) {
      throw error;
    }
  }
};
