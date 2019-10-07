const GuildMock = require('./guildMock');

const usernames = [
  'cody',
  'tanb01',
  'minimabu',
  'Rest In Pizzeria',
  'papishampu'
];

let incrementalId = 0;
const createGuildMemberMock = () => {
  const user = usernames[Math.floor(Math.random() * usernames.length)];
  incrementalId++;
  const id = `${incrementalId}`;

  return {
    displayName: user,
    id,
    guild: GuildMock,
    send: jest.fn(),
    user: {
      game: null
    }
  };
};

module.exports = {
  createGuildMemberMock
};
