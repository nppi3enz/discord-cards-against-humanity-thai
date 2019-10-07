const { prepareScoreboardMessage } = require('.');
const { scoreboardMock } = require('../../../__mocks__/gameMock');

describe('Utils: Game', () => {
  test('should return a string.', () => {
    const scoreboardMessage = prepareScoreboardMessage(scoreboardMock);
    expect(typeof scoreboardMessage).toBe('string');
  });
});
