const { MessageEmbed } = require('discord.js');
const { MESSAGE_EMBED_COLOR, GAME_STATUS } = require('../../common/constants');

const positionEmojis = [
  ':fire:',
  ':star2:',
  ':ok_hand:',
  ':poop:'
];

function prepareScoreboardMessage(scoreboard) {
  let scoreboardString = '';
  const lastPositionEmojiIndex = positionEmojis.length - 1;

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
    const positionEmoji = positionEmojis[Math.min(index, lastPositionEmojiIndex)];
    scoreboardString += `${positionEmoji} **${playerScore.name}** - ${playerScore.score} ${playerScore.score !== 1 ? 'points' : 'point'}.`;
  });

  return scoreboardString;
}

module.exports = {
  name: 'score',
  description: "Show a scoreboard with the players' current scores.",
  gamemasterOnly: false,
  requiredGameStatus: GAME_STATUS.playing,
  execute(message, options) {
    const { game } = message.guild || message.author;

    try {
      const scoreboard = game.getScoreboard();
      const scoreboardMessage = prepareScoreboardMessage(scoreboard);

      const embed = new MessageEmbed()
        .setTitle('Scoreboard')
        .setColor(MESSAGE_EMBED_COLOR)
        .addField(`The score is as follows:`, scoreboardMessage);

      message.channel.send(embed);
    } catch (error) {
      if (error.name === 'GameStatusError') {
        message.reply('the game has not been started yet.');
      } else {
        throw error;
      }
    }
  }
};
