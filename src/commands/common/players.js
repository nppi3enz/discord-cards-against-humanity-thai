const { MessageEmbed } = require('discord.js');
const { MESSAGE_EMBED_COLOR, GAME_STATUS } = require('../../common/constants');

const playerEmojis = [
  ':baby:',
  ':boy:',
  ':girl:',
  ':man:',
  ':woman:',
  ':person_with_blond_hair:',
  ':older_man:',
  ':older_woman:',
  ':man_with_gua_pi_mao:'
];

function preparePlayerListMessage(players) {
  let playerListString = '';
  const playerEmojisLength = playerEmojis.length;

  for (const player of players) {
    const playerEmoji = playerEmojis[Math.floor(Math.random() * playerEmojisLength)];
    playerListString += `${playerEmoji} **${player.name} ${player.isGamemaster ? '(Gamemaster)' : ''}**`;
  }

  return playerListString;
}

module.exports = {
  name: 'players',
  description: 'Show a list of the current players in-game.',
  gamemasterOnly: false,
  requiredGameStatus: GAME_STATUS.preparing || GAME_STATUS.playing,
  execute(message, options) {
    const { players } = message.author.game;
    const playerList = preparePlayerListMessage(players);
    const numberOfPlayers = players.length;

    const fieldTitle = numberOfPlayers > 1
      ? `There are currently ${numberOfPlayers} players in-game!`
      : `There's currently ${numberOfPlayers} player in-game!`;

    const embed = new MessageEmbed()
      .setTitle('Player List')
      .setColor(MESSAGE_EMBED_COLOR)
      .addField(fieldTitle, playerList);

    message.channel.send(embed);
  }
};
