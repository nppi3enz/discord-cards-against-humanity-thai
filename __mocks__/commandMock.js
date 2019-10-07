class CommandMock {
  constructor(name, gamemasterOnly = false, requiredGameStatus = null) {
    this.name = name;
    this.description = 'Command description.';
    this.gamemasterOnly = gamemasterOnly;
    this.requiredGameStatus = requiredGameStatus;
    this.execute = jest.fn();
  }
}

const guildCommandMock = new CommandMock('guildCommand');
const dmCommandMock = new CommandMock('dmCommand');
const commonCommandMock = new CommandMock('commonCommand');

const failingCommandMock = new CommandMock('failing');
failingCommandMock.execute = () => {
  throw new Error('Oops, I failed...');
};

const createCommandMock = (name, gamemasterOnly = false, requiredGameStatus = null) => {
  return new CommandMock(name, gamemasterOnly, requiredGameStatus);
};

module.exports = {
  CommandMock,
  guildCommandMock,
  dmCommandMock,
  commonCommandMock,
  failingCommandMock,
  createCommandMock
};
