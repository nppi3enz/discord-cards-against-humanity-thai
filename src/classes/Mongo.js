const mongoose = require('mongoose');
const { mongodb_uri: mongodbURI } = getConfig();
const mongoHandlers = require('../events/handlers/mongo');
const { GuildSchema } = require('../../data/schemas');
const { MONGO_ERROR_CODES } = require('../common/constants');

class MongoAdapter {
  constructor(client) {
    this.client = client;

    this.mongo = mongoose.createConnection(mongodbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    });

    this.MongoGuild = this.mongo.model('Guild', GuildSchema);

    this.mongo.on('connected', mongoHandlers.handleConnected);
    this.mongo.on('connecting', mongoHandlers.handleConnecting);
    this.mongo.on('disconnected', mongoHandlers.handleDisconnect);
    this.mongo.on('error', (error) => mongoHandlers.handleError(error));
    this.mongo.on('reconnected', mongoHandlers.handleReconnected);
  }

  initializeMongo() {
    this.client.guilds.each((guild) => {
      this.createGuild(guild);
    });
  }

  createGuild(guild) {
    const mongoGuild = new this.MongoGuild({
      id: guild.id
    });

    return mongoGuild.save((error) => {
      if (error) {
        if (error.code !== MONGO_ERROR_CODES.duplicate) {
          logger.error(error);
        }
        return;
      }
      logger.info(`(MONGO): Saved document for ${guild.name}.`);
    });
  }

  deleteGuild(guild) {
    return new Promise((resolve, reject) => {
      this.MongoGuild.findOneAndDelete({
        id: guild.id
      }, (error) => {
        if (error) {
          logger.error(error);
          reject(error);
          return;
        }
        logger.info(`(MONGO): Deleted document for ${guild.name}.`);
        resolve();
      });
    });
  }

  updateSettings(guild, settings) {
    const { id: guildId, name: guildName } = guild;

    return new Promise((resolve, reject) => {
      this.MongoGuild.findOneAndUpdate({
        id: guildId
      }, {
        ...settings
      }, (error) => {
        if (error) {
          logger.error(`(MONGO): There was an error when trying to change the game settings for ${guildName}.`, error);
          reject(error);
          return;
        }
        logger.info(`(MONGO): Updated game settings for ${guildName}.`);
        resolve();
      });
    });
  }

  getGuild(id) {
    return new Promise((resolve, reject) => {
      this.MongoGuild.findOne({
        id
      }, (error, fetchedGuild) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(fetchedGuild);
      });
    });
  }
}

module.exports = MongoAdapter;
