const { prepareScoreboardMessage } = require('.');

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

describe('Utils: Game', () => {
  test('should return a string.', () => {
    const scoreboardMessage = prepareScoreboardMessage(scoreboardMock);
    expect(typeof scoreboardMessage).toBe('string');
  });
});
