const { MessageEmbed } = require('discord.js');
const { MESSAGE_EMBED_COLOR, GAME_STATUS } = require('../../common/constants');
const { prepareScoreboardMessage } = require('../../utils/game');

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
