const { MAX_EMBED_FIELD_SIZE } = require('../../common/constants');

/**
 * Receives an array of strings and splits them in an array to form 'paged' MessageEmbed fields.
 * @throws If one of the messages in the parameter array is larger than 1024 characters.
 * @param {[String]} strings Array of strings containing the strings to split for the MessageEmbed fields.
 * @returns {[String]} The splitted array of strings.
 */
const splitForMessageEmbedField = (strings = []) => {
  const splittedStrings = [];
  let singleMessage = '';
  let stringsCounter = 0;

  while (stringsCounter < strings.length) {
    const newStringLength = strings[stringsCounter].length;

    if (newStringLength >= MAX_EMBED_FIELD_SIZE) {
      throw new Error(`One of the messages is longer than ${MAX_EMBED_FIELD_SIZE} characters.`);
    }

    if (singleMessage.length < MAX_EMBED_FIELD_SIZE - newStringLength) {
      singleMessage += strings[stringsCounter];
      stringsCounter++;
    } else {
      splittedStrings.push(singleMessage);
      singleMessage = '';
    }
  }

  if (singleMessage.length > 0) {
    splittedStrings.push(singleMessage);
  }

  return splittedStrings;
};

/**
 * Parse command arguments into an object containing the sub command and the list of the arguments.
 * @param {[String]} args The original arguments array received from the message input.
 * @returns {Object} The parsed arguments object.
 */
const parseArgs = (args = []) => {
  const subCommand = args.shift();

  if (!subCommand) {
    return {
      subCommand: null
    };
  }

  return {
    subCommand,
    argsList: args
  };
};

/**
 * Parses a Channel string received from message mention and returns an object containing the respective
 * Channel object and other data about the channel.
 * @param {Message} message The message object that triggered the command.
 * @param {String} channelString The string of the channel mention.
 * @returns {Object} The object containing the corresponding Channel object and other information.
 */
const parseChannelMention = (message, channelString = '') => {
  const numberRegex = /[^0-9]+/gi;
  const strippedId = channelString.replace(numberRegex, '');

  if (!strippedId) {
    return {
      exists: false
    };
  }

  const channel = message.guild.channels.find(channel => channel.id === strippedId);

  if (!channel) {
    return {
      exists: false
    };
  }

  return {
    channel,
    type: channel.type,
    exists: true,
    viewable: channel.viewable,
    joinable: channel.type === 'voice' ? channel.joinable : null
  };
};

module.exports = {
  splitForMessageEmbedField,
  parseArgs,
  parseChannelMention
};
