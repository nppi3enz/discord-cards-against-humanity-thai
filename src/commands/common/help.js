const { MessageEmbed } = require('discord.js');
const { prefix } = getConfig();
const utils = require('../../utils');
const { MESSAGE_EMBED_COLOR, MESSAGE_EMBED_HELP_THUMBNAIL } = require('../../common/constants');

function processCommands(commands) {
  const commandMessages = [];

  for (const command of commands) {
    commandMessages.push(`**${prefix}${command[1].name}** - ${command[1].description}\n`);
  }

  return commandMessages;
}

module.exports = {
  name: 'help',
  description: 'A help message to display all the commands available to the user.',
  gamemasterOnly: false,
  requiredGameStatus: null,
  execute(message, options) {
    let messageOrigin = null;
    let commandsCollection = null;

    if (message.guild) {
      messageOrigin = 'Guild';
      commandsCollection = options.commands.guild.concat(options.commands.common);
    } else {
      messageOrigin = 'DM';
      commandsCollection = options.commands.dm.concat(options.commands.common);
    }

    const commands = processCommands(commandsCollection);
    const splittedMessage = utils.common.splitForMessageEmbedField(commands);

    const embed = new MessageEmbed()
      .setTitle(`A list of available ${messageOrigin} commands:`)
      .setColor(MESSAGE_EMBED_COLOR)
      .setThumbnail(MESSAGE_EMBED_HELP_THUMBNAIL);
    for (let i = 0; i < splittedMessage.length; i++) {
      embed.addField(`Page ${i + 1}:`, splittedMessage[i]);
    }

    message.channel.send(embed);
  }
};
