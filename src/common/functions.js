const { Logger } = require('logger');
const logger = new Logger();

const updatePresence = (client) => {
  const presence = `${client.guilds.size} servers!`;
  client.user.setPresence({
    activity: {
      name: presence,
      type: 'PLAYING'
    }
  }).then( () => {
    logger.info(`Presence updated to: ${presence}`)
  }).catch( (err) => {
    logger.error(err);
  });
}

module.exports = {
  updatePresence
}