const { MessageEmbed } = require('discord.js');
const { MESSAGE_EMBED_COLOR, GAME_STATUS, PLAYER_EMOJIS } = require('../../common/constants');

function preparePlayerListMessage(players) {
  let playerListString = '';
  const playerEmojisLength = PLAYER_EMOJIS.length;

  for (const player of players) {
    const playerEmoji = PLAYER_EMOJIS[Math.floor(Math.random() * playerEmojisLength)];
    playerListString += `${playerEmoji} **${player.name} ${player.isGamemaster ? '(Gamemaster)' : ''}**\n`;
  }

  return playerListString;
}

module.exports = {
  name: 'players',
  description: 'Show a list of the current players in-game.',
  gamemasterOnly: false,
  requiredGameStatus: GAME_STATUS.any,
  execute(message, options) {
    const { game } = message.guild || message.author;
    const playerList = preparePlayerListMessage(game.players);
    const fieldTitle = `Current players: ${game.getPlayersLabel()}`;

    const embed = new MessageEmbed()
      .setTitle('Player List')
      .setColor(MESSAGE_EMBED_COLOR)
      .addField(fieldTitle, playerList);

    message.channel.send(embed);
  }
};
