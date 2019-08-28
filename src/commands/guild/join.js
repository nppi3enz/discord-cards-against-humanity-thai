const { MESSAGE_EMBED_COLOR, GAME_STATUS } = require('../../common/constants');
const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'join',
  description: 'A join command to join the current game lobby!',
  gamemasterOnly: false,
  requiredGameStatus: GAME_STATUS.preparing,
  execute(message, options) {
    const { game } = message.guild;

    try {
      const newPlayer = game.addPlayer(message.member);
      message.author.game = game;

      game.broadcastToPlayers(`**${message.member.displayName}** has joined the game.`, newPlayer);

      const playerNames = game.players.reduce((previousPlayerNames, currentPlayer) => {
        if (currentPlayer.name !== newPlayer.name) {
          previousPlayerNames.push(currentPlayer.name);
        }
        return previousPlayerNames;
      }, []).join(', ');

      const playersLabel = game.getPlayersLabel();

      const embed = new MessageEmbed()
        .setColor(MESSAGE_EMBED_COLOR)
        .addField(`You have joined a game hosted by **${game.gamemaster.name}**.`, `The game is currently being set-up.
        You have joined a game with ${playerNames}. ${playersLabel}`);
      message.member.send(embed);
    } catch (error) {
      if (error.name === 'GameStatusError' || error.name === 'GamePlayersError') {
        message.reply(error.message);
      } else if (error.name === 'PlayerError') {
        message.reply("you're already in-game!");
      } else {
        throw error;
      }
    }
  }
};
