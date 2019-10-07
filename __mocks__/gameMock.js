const { GAME_STATUS } = require('../src/common/constants');

const createGameMock = (status = GAME_STATUS.preparing) => ({
  status,
  gamemaster: {
    id: '123'
  }
});

const scoreboardMock = [
  {
    name: 'minibambu',
    id: 3000,
    score: 2
  },
  {
    name: 'moonstar-x',
    id: 1000,
    score: 3
  }
];

module.exports = {
  createGameMock,
  scoreboardMock
};
