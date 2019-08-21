const { GAME_STATUS } = require('../../common/constants');

module.exports = {
  name: 'stop',
  description: 'The stop command to terminate the on-going game.',
  gamemasterOnly: true,
  requiredGameStatus: GAME_STATUS.any,
  execute(message, options) {
    const { game } = message.author;
    game.end();
  }
};
