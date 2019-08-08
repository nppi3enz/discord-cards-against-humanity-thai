const { updatePresence } = require('./functions');
require('./globals');

let client = {};
const defaultPresenceName = 'ClientUser Presence';

describe('Common: Functions', () => {
  describe('updatePresence()', () => {
    beforeEach(() => {
      client = {
        guilds: {
          size: 10
        },
        user: {
          setPresence: function (newPresence) {
            return new Promise((resolve, reject) => {
              this.presence = newPresence;
              resolve();
            });
          },
          presence: {
            activity: {
              name: defaultPresenceName,
              type: 'PLAYING'
            }
          }
        }
      };
    });

    test('should update client presence.', () => {
      updatePresence(client);
      expect(client.user.presence.activity.name).not.toBe(defaultPresenceName);
      const guildSize = client.guilds.size;
      expect(client.user.presence.activity.name).toBe(`${guildSize} servers!`);
    });
  });
});
