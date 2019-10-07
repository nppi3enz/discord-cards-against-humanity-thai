const CollectionMock = require('./collectionMock');
const { guildCommandMock, dmCommandMock, commonCommandMock } = require('./commandMock');

class Client {
  constructor() {
    this.guilds = {
      size: 10
    };
    this.user = {
      setPresence: (newPresence) => {
        return new Promise((resolve, reject) => {
          try {
            this.presence = newPresence;
            resolve();
          } catch (error) {
            reject(error);
          }
        });
      },
      presence: {
        activity: {
          name: 'default presence name',
          type: 'PLAYING'
        }
      }
    };
    this.commands = {
      guild: new CollectionMock(guildCommandMock),
      dm: new CollectionMock((dmCommandMock)),
      common: new CollectionMock(commonCommandMock)
    };
  }
}

const createClientMock = () => {
  return new Client();
};

module.exports = createClientMock;
