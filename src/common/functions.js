/**
 * Updates the presence of the Discord bot.
 * @param {Client} client The Discord client to update the presence.
 * @returns {Promise}
 */
const updatePresence = (client) => {
  const presence = `${client.guilds.size} servers!`;
  return client.user.setPresence({
    activity: {
      name: presence,
      type: 'PLAYING'
    }
  }).then(() => {
    logger.info(`Presence updated to: ${presence}`);
  }).catch((err) => {
    logger.error(err);
  });
};

module.exports = {
  updatePresence
};
