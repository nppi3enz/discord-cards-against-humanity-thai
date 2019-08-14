const { GAME_STATUS } = require('../../common/constants');
const { parseArgs } = require('../../utils/common');
const { prefix } = getConfig();

module.exports = {
  name: 'kick',
  description: 'Kick a player from the game by typing their name.',
  gamemasterOnly: true,
  requiredGameStatus: GAME_STATUS.any,
  execute(message, options) {
    const { game } = message.author;
    const { subCommand: playerName } = parseArgs(options.args);

    if (!playerName) {
      message.reply('you need to specify the name of the person you want to kick.');
      return;
    }

    try {
      const kickedPlayer = game.kickPlayer(playerName);
      if (kickedPlayer) {
        game.broadcastToPlayers(`Player ${kickedPlayer.name} has been kicked!`);
      }
    } catch (error) {
      if (error.name === 'GamePlayersError') {
        message.reply(`you cannot kick yourself. If you wish to leave the game, run **${prefix}leave**.`);
      } else {
        throw error;
      }
    }
  }
};
