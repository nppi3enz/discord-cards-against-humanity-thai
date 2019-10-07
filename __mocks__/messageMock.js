const guildMessageMock = {
  guild: {
    name: 'Guild Name',
    channels: []
  },
  member: {
    displayName: 'memberName'
  },
  author: {
    game: null
  },
  reply: jest.fn()
};

const dmMessageMock = {
  author: {
    username: 'username',
    game: null
  },
  reply: jest.fn()
};

module.exports = {
  guildMessageMock,
  dmMessageMock
};
