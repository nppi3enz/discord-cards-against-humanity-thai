const { validateCommand, executeCommand } = require('.');
require('../../common/globals');

class CommandMock {
  constructor(name) {
    this.name = name;
    this.description = 'Command description.';
    this.execute = jest.fn();
  }
}

class CollectionMock {
  constructor(command) {
    this.content = {
      [command.name]: command,
      failing: failingCommandMock
    };
  }

  has(contentProp) {
    return this.content.hasOwnProperty(contentProp);
  }

  get(contentProp) {
    if (!this.content.hasOwnProperty(contentProp)) {
      return null;
    }
    return this.content[contentProp];
  }
}

const guildCommandMock = new CommandMock('guildCommand');
const dmCommandMock = new CommandMock('dmCommand');
const commonCommandMock = new CommandMock('commonCommand');
const failingCommandMock = new CommandMock('failing');
failingCommandMock.execute = function() {
  throw new Error('Oops, I failed...');
};

const clientMock = {
  commands: {
    guild: new CollectionMock(guildCommandMock),
    dm: new CollectionMock(dmCommandMock),
    common: new CollectionMock(commonCommandMock)
  }
};
const guildMessageMock = {
  guild: {
    name: 'Guild Name'
  },
  member: {
    displayName: 'memberName'
  },
  reply: jest.fn()
};
const dmMessageMock = {
  author: {
    username: 'username'
  },
  reply: jest.fn()
};

describe('Utils: Commands', () => {
  describe('validateCommand()', () => {
    test('should return an object.', () => {
      const actualResult = validateCommand(clientMock, guildMessageMock, guildCommandMock.name);
      expect(actualResult).toBeInstanceOf(Object);
    });

    test('should return an object with no null properties (except for type).', () => {
      const actualResult = validateCommand(clientMock, guildMessageMock, guildCommandMock.name);
      for (const key in actualResult) {
        if (key === 'type') {
          continue;
        }
        expect(actualResult[key]).not.toBeNull();
      }
    });

    test('should contain an author property equal to the message author.', () => {
      const fromGuild = validateCommand(clientMock, guildMessageMock, guildCommandMock.name);
      expect(fromGuild.author).toBe(guildMessageMock.member.displayName);
      const fromDM = validateCommand(clientMock, dmMessageMock, dmCommandMock.name);
      expect(fromDM.author).toBe(dmMessageMock.author.username);
    });

    test("should contain an origin property equal to the message's source.", () => {
      const fromGuild = validateCommand(clientMock, guildMessageMock, guildCommandMock.name);
      expect(fromGuild.origin).toBe(guildMessageMock.guild.name);
      const fromDM = validateCommand(clientMock, dmMessageMock, dmCommandMock.name);
      expect(fromDM.origin).toBe('DM');
    });

    test('should contain a type property equal to the type of the command (common, dm or guild).', () => {
      const commonCommandFromGuild = validateCommand(clientMock, guildMessageMock, commonCommandMock.name);
      expect(commonCommandFromGuild.type).toBe('common');
      const commonCommandFromDM = validateCommand(clientMock, dmMessageMock, commonCommandMock.name);
      expect(commonCommandFromDM.type).toBe('common');
      const guildCommand = validateCommand(clientMock, guildMessageMock, guildCommandMock.name);
      expect(guildCommand.type).toBe('guild');
      const dmCommand = validateCommand(clientMock, dmMessageMock, dmCommandMock.name);
      expect(dmCommand.type).toBe('dm');
    });

    test('should contain a null type property if command does not exist.', () => {
      const unknownCommand = validateCommand(clientMock, guildMessageMock, 'i dont exist');
      expect(unknownCommand.type).toBeNull();
      const dmCommandFromGuild = validateCommand(clientMock, guildMessageMock, dmCommandMock.name);
      expect(dmCommandFromGuild.type).toBeNull();
      const guildCommandFromDM = validateCommand(clientMock, dmMessageMock, guildCommandMock.name);
      expect(guildCommandFromDM.type).toBeNull();
    });
  });

  describe('executeCommand()', () => {
    afterEach(() => {
      guildMessageMock.reply.mockClear();
      dmMessageMock.reply.mockClear();
      guildCommandMock.execute.mockClear();
      dmCommandMock.execute.mockClear();
      commonCommandMock.execute.mockClear();
    });

    test('should not execute if command does not exist.', () => {
      executeCommand(clientMock, guildMessageMock, undefined, dmCommandMock.name);
      expect(dmCommandMock.execute.mock.calls.length).toBe(0);
    });

    test('should reply to message if command throws.', () => {
      executeCommand(clientMock, guildMessageMock, undefined, failingCommandMock.name);
      expect(guildMessageMock.reply.mock.calls.length).toBe(1);
      executeCommand(clientMock, dmMessageMock, undefined, failingCommandMock.name);
      expect(dmMessageMock.reply.mock.calls.length).toBe(1);
    });

    test('should execute if command is successful.', () => {
      executeCommand(clientMock, guildMessageMock, undefined, guildCommandMock.name);
      expect(guildCommandMock.execute.mock.calls.length).toBe(1);
      executeCommand(clientMock, dmMessageMock, undefined, dmCommandMock.name);
      expect(dmCommandMock.execute.mock.calls.length).toBe(1);
      executeCommand(clientMock, dmMessageMock, undefined, commonCommandMock.name);
      expect(commonCommandMock.execute.mock.calls.length).toBe(1);
      executeCommand(clientMock, guildMessageMock, undefined, commonCommandMock.name);
      expect(commonCommandMock.execute.mock.calls.length).toBe(2);
    });
  });
});
