const { updatePresence } = require('../../common/functions');
const utils = require('../../utils');
const { prefix } = getConfig();

const handleReady = (mongo) => {
  logger.info('Connected to Discord! - Ready.');
  updatePresence(mongo.client);
  mongo.initializeMongo();
};

const handleMessage = (message, mongo) => {
  if (!message.content.startsWith(prefix) || message.author.bot) {
    return;
  }

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  const options = {
    args,
    commands: mongo.client.commands
  };

  utils.commands.executeCommand(mongo.client, message, options, command);
};

const handleGuildCreate = (guild, mongo) => {
  logger.info(`Joined ${guild.name} guild!`);
  mongo.createGuild(guild);
};

const handleGuildDelete = (guild, mongo) => {
  logger.info(`Left ${guild.name} guild!`);
  mongo.deleteGuild(guild);
};

const handleGuildUnavailable = (guild) => {
  logger.info(`Guild ${guild.name} is currently unavailable!`);
};

const handleWarn = (info) => {
  logger.warn(info);
};

const handleInvalidated = () => {
  logger.error('Client connection invalidated, terminating execution with code 1.');
  process.exit(1);
};

const handleError = (error) => {
  logger.error(error);
};

const handleDebug = (info) => {
  logger.debug(info);
};

module.exports = {
  handleReady,
  handleMessage,
  handleGuildCreate,
  handleGuildDelete,
  handleGuildUnavailable,
  handleWarn,
  handleInvalidated,
  handleError,
  handleDebug
};
