const { GAME_STATUS } = require('../../common/constants');

/**
 * Validates the command run by an user and returns an object containing the required information
 * that the bot needs to run the actual command.
 * @param {Client} client The client instance of the bot.
 * @param {Message} message The message object that triggered this method.
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
 * Validates the command's game status requirement.
 * @param {Object} game The message author's guild's game object.
 * @param {Object} command The issued command object.
 * @returns {Boolean} Whether the validation passes or fails.
 */
const validateRequiredGameStatus = (game, command) => {
  const { requiredGameStatus } = command;
  if (!requiredGameStatus) {
    return true;
  }

  return !(!game || (game.status !== requiredGameStatus && requiredGameStatus !== GAME_STATUS.any));
};

/**
 * Validates the command's gamemaster privilege requirement.
 * @param {Object} game The message author's guild's game object.
 * @param {Object} command The issued command object.
 * @param {String} authorId The author's ID.
 * @returns {Boolean} Whether the validation passes or fails.
 */
const validateGamemasterOnly = (game, command, authorId) => {
  if (command.gamemasterOnly) {
    if (!game || game.gamemaster.id !== authorId) {
      return false;
    }
  }

  return true;
};

/**
 * Executes the specified command.
 * @param {Client} client The client instance of the bot.
 * @param {Message} message The message object that triggered this method.
 * @param {Object} options The object containing the data that the command may need.
 * @param {String} commandName The name of the command being run.
 * @returns {void}
 */
const executeCommand = (client, message, options, commandName) => {
  const { author, type, origin } = validateCommand(client, message, commandName);

  if (!type) {
    return;
  }

  const command = client.commands[type].get(commandName);

  const { id: authorId } = message.author;
  const { game } = message.guild || message.author;

  const isGameStatusValidated = validateRequiredGameStatus(game, command);
  if (!isGameStatusValidated) {
    switch (command.requiredGameStatus) {
    case GAME_STATUS.preparing:
      message.reply('this command can only be run if the game is being prepared.');
      return;
    case GAME_STATUS.playing:
      message.reply('this command can only be run if the game is currently being played.');
      return;
    case GAME_STATUS.any:
      message.reply('this command can only be run if there is a game running.');
      return;
    default:
      message.reply("something happened when trying to execute your command. Probably the command doesn't have the required game status set correctly.");
      return;
    }
  }

  const isGamemasterOnlyValidated = validateGamemasterOnly(game, command, authorId);
  if (!isGamemasterOnlyValidated) {
    message.reply('this command can only be run by a gamemaster.');
    return;
  }

  try {
    logger.info(`User ${author} issued ${type} command ${command.name} in ${origin}.`);
    command.execute(message, options);
  } catch (err) {
    logger.error(err);
    message.reply("there's been a problem executing your command.");
  }
};

module.exports = {
  validateCommand,
  validateRequiredGameStatus,
  validateGamemasterOnly,
  executeCommand
};
