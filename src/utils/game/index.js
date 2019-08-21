const { POSITION_EMOJIS } = require('../../common/constants');

function prepareScoreboardMessage(scoreboard) {
  let scoreboardString = '';
  const lastPositionEmojiIndex = POSITION_EMOJIS.length - 1;

  const sortedScoreboard = scoreboard.sort((prev, cur) => {
    if (prev.score < cur.score) {
      return 1;
    }
    if (prev.score > cur.score) {
      return -1;
    }
    return 0;
  });

  sortedScoreboard.forEach((playerScore, index) => {
    const positionEmoji = POSITION_EMOJIS[Math.min(index, lastPositionEmojiIndex)];
    scoreboardString += `${positionEmoji} **${playerScore.name}** - ${playerScore.score} ${playerScore.score !== 1 ? 'points' : 'point'}.`;
  });

  return scoreboardString;
}

module.exports = {
  prepareScoreboardMessage
};
