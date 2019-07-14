const { Logger } = require('logger');
const logger = new Logger();

const validateCommand = (client, message, command) => {
  const validatedInfo = {
    type: null,
    author: null,
    origin: null
  };

  if (message.guild) {
    if (client.commands.guild.has(command)) {
      validatedInfo.type = 'guild';
    } else if (client.commands.common.has(command)) {
      validatedInfo.type = 'common';
    }
    validatedInfo.author = message.member.displayName;
    validatedInfo.origin = message.guild.name;
  } else {
    if (client.commands.dm.has(command)) {
      validatedInfo.type = 'dm';
    } else if (client.commands.common.has(command)) {
      validatedInfo.type = 'common';
    }
    validatedInfo.author = message.author.username;
    validatedInfo.origin = 'DM';
  }

  return validatedInfo;
};

const executeCommand = (client, message, options, command) => {
  const { author, type, origin } = validateCommand(client, message, command);

  if (!type) {
    return;
  }

  try {
    logger.info(`User ${author} issued ${type} command ${command} in ${origin}.`);
    client.commands[type].get(command).execute(message, options);
  } catch (err) {
    logger.error(err);
    message.reply("there's been a problem executing your command.");
  }
};

module.exports = {
  executeCommand
};
