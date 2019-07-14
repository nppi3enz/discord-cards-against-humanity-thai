const { Client, Collection } = require('discord.js');
const fs = require('fs-extra');
const path = require('path');
const appHandlers = require('./events/handlers/app');
const constants = require('./common/constants');
const config = require('../config/settings.json');

const client = new Client();
client.commands = {};

function loadCommands(type) {
  client.commands[type] = new Collection();
  const commandFiles = fs.readdirSync(path.join(__dirname, '/commands/', type)).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const command = require(`./commands/${type}/${file}`);
    client.commands[type].set(command.name, command);
  }
}

for (const type of constants.COMMAND_TYPES) {
  loadCommands(type);
}

client.on('ready', () => appHandlers.handleReady(client));
client.on('message', message => appHandlers.handleMessage(message, client));
client.on('guildCreate', guild => appHandlers.handleGuildCreate(guild));
client.on('guildDelete', guild => appHandlers.handleGuildDelete(guild));
client.on('guildUnavailable', guild => appHandlers.handleGuildUnavailable(guild));
client.on('warn', info => appHandlers.handleWarn(info));
client.on('invalidated', appHandlers.handleInvalidated);
client.on('error', error => appHandlers.handleError(error));

if (process.argv[2] === '--debug') {
  client.on('debug', info => appHandlers.handleDebug(info));
}

client.login(config.discord_token);
