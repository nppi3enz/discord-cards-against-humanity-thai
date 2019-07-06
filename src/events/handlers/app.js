const { Logger } = require('logger');
const { updatePresence } = require('../../common/functions');
const { prefix } = require('../../../config/settings.json');
const logger = new Logger();

const handleReady = (client) => {
  logger.info('Connected to Discord! - Ready.');
  updatePresence(client);
}

const handleMessage = (message, client) => {
  
}

const handleGuildCreate = (guild) => {
  logger.info(`Joined ${guild.name} guild!`);
}

const handleGuildDelete = (guild) => {
  logger.info(`Left ${guild.name} guild!`);
}

const handleGuildUnavailable = (guild) => {
  logger.info(`Guild ${guild.name} is currently unavailable!`);
}

const handleWarn = (info) => {
  logger.warn(info);
}

const handleInvalidated = () => {
  logger.error('Client connection invalidated, terminating execution with code 1.');
  process.exit(1);
}

const handleError = (error) => {
  logger.error(error);
}

const handleDebug = (info) => {
  logger.debug(info);
}

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
}