/**
 * Validates the command run by an user and returns an object containing the required information
 * that the bot needs to run the actual command.
 * @param {Discord.Client} client The client instance of the bot.
 * @param {Discord.Message} message The message object that triggered this method.
 * @param {String} command The name of the command being run.
 * @returns {Object} The object containing the validated info on the command.
 */
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

/**
 * Executes the specified command.
 * @param {Discord.Client} client The client instance of the bot.
 * @param {Discord.Message} message The message object that triggered this method.
 * @param {Object} options The object containing the data that the command may need.
 * @param {String} command The name of the command being run.
 * @returns {void}
 */
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
  validateCommand,
  executeCommand
};
