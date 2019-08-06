const { Logger } = require('logger');
global.logger = new Logger();

global.getConfig = () => {
  return process.env.DISCORD_TOKEN
    ? {
      discord_token: process.env.DISCORD_TOKEN,
      prefix: process.env.PREFIX
    }
    : require('../../config/settings.json');
};
