const { Client, Collection } = require('discord.js');
const fs = require('fs-extra');
const appHandlers = require('./events/handlers/app');
const config = require('../config/settings.json');

const client = new Client();

client.commands = new Collection();
const commandFiles = fs.readdirSync(__dirname + '/commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.on('ready', () => appHandlers.handleReady(client));
client.on('message', message => appHandlers.handleMessage(message, client));
client.on('guildCreate', guild => appHandlers.handleGuildCreate(guild));
client.on('guildDelete', guild => appHandlers.handleGuildDelete(guild));
client.on('guildUnavailable', guild  => appHandlers.handleGuildUnavailable(guild));
client.on('warn', info => appHandlers.handleWarn(info));
client.on('invalidated', appHandlers.handleInvalidated);
client.on('error', error => appHandlers.handleError(error));

if (process.argv[2] == '--debug') {
  client.on('debug', info => appHandlers.handleDebug(info));
}  

client.login(config.discord_token);