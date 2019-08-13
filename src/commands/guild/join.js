const { MESSAGE_EMBED_COLOR } = require('../../common/constants');
const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'join',
  description: 'A join command to join the current game lobby!',
  execute(message, options) {
    const { game } = message.guild;
    if (!game) {
      message.reply("there's no game currently being played.");
      return;
    }
    try {
      const newPlayer = game.addPlayer(message.member);
      message.author.game = game;

      game.broadcastToPlayers(`**${message.member.displayName}** has joined the game.`, newPlayer);
      const currentNumberOfPlayers = game.players.length;
      const maxNumberOfPlayers = 10;
      const playerNames = game.players.map(player => player.name).join(', ');

      const embed = new MessageEmbed()
        .setColor(MESSAGE_EMBED_COLOR)
        .addField(`You have joined a game hosted by **${game.gamemaster.name}**.`, `The game is currently being set-up.
        You have joined a game with ${playerNames}. (${currentNumberOfPlayers}/${maxNumberOfPlayers})`);
      message.member.send(embed);
    } catch (error) {
      if (error.name === 'GameStatusError' || error.name === 'GamePlayersError') {
        message.reply(error.message);
      } else {
        throw error;
      }
    }
  }
};
