require('./globals');
const { updatePresence } = require('./functions');
const createClientMock = require('../../__mocks__/clientMock');

describe('Common: Functions', () => {
  let client;

  beforeEach(() => {
    client = createClientMock();
  });

  describe('updatePresence()', () => {
    test('should update client presence.', () => {
      const { activity } = client.user.presence;
      const oldPresenceName = activity.name;
      updatePresence(client)
        .then(() => {
          expect(activity.name).not.toBe(oldPresenceName);
          const { size } = client.guilds;
          expect(client.user.presence.activity.name).toBe(`${size} servers!`);
          logger.info(activity.name);
        })
        .catch(() => {});
    });
  });
});
