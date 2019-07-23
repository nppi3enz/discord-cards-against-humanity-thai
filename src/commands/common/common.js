const utils = require('../../utils');

module.exports = {
  name: 'common',
  description: 'A sample ping command. Should work in guilds and DM.',
  execute(message, options) {
    const args = utils.common.parseArgs(options.args);

    switch (args.subCommand) {
    case 'test':
      message.reply('test sub!');
      break;
    default:
      message.reply('invalid subcommand!');
      break;
    }
  }
};
