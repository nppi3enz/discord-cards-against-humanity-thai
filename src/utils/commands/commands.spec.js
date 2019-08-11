const { validateCommand, executeCommand, validateRequiredGameStatus, validateGamemasterOnly } = require('.');
const { GAME_STATUS } = require('../../common/constants');
require('../../common/globals');

class CommandMock {
  constructor(name, gamemasterOnly = false, requiredGameStatus = null) {
    this.name = name;
    this.description = 'Command description.';
    this.gamemasterOnly = gamemasterOnly;
    this.requiredGameStatus = requiredGameStatus;
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

const createGameMock = (status = GAME_STATUS.preparing) => ({
  status,
  gamemaster: {
    id: '123'
  }
});

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

  describe('validateRequiredGameStatus()', () => {
    test('should return a boolean.', () => {
      const command = new CommandMock();
      const validated = validateRequiredGameStatus(undefined, command);
      expect(typeof validated).toBe('boolean');
    });

    test('should return true if required game status by command is null.', () => {
      const noRequirementsCommand = new CommandMock('cmd');
      const validated = validateRequiredGameStatus(createGameMock(), noRequirementsCommand);
      expect(validated).toBe(true);
    });

    test('should return false if game parameter is undefined and a game status is required.', () => {
      /* Undefined is specified here because this function will never omit
      the game param. It may be undefined however if no game instance for a
      certain guild does not exist. */
      const requiringCommand = new CommandMock('name', false, GAME_STATUS.preparing);
      const validated = validateRequiredGameStatus(undefined, requiringCommand);
      expect(validated).toBe(false);
    });

    test('should return false if game status does not correspond to the game status required by the command.', () => {
      const preparingCommand = new CommandMock('preparing', false, GAME_STATUS.preparing);
      const playingCommand = new CommandMock('playing', false, GAME_STATUS.playing);
      const preparingGame = createGameMock(GAME_STATUS.preparing);
      const playingGame = createGameMock(GAME_STATUS.playing);
      const validatePreparingCommand = validateRequiredGameStatus(playingGame, preparingCommand);
      expect(validatePreparingCommand).toBe(false);
      const validatePlayingCommand = validateRequiredGameStatus(preparingGame, playingCommand);
      expect(validatePlayingCommand).toBe(false);
    });

    test('should return true if game status corresponds with the game status required by the command.', () => {
      const preparingCommand = new CommandMock('preparing', false, GAME_STATUS.preparing);
      const playingCommand = new CommandMock('playing', false, GAME_STATUS.playing);
      const preparingGame = createGameMock(GAME_STATUS.preparing);
      const playingGame = createGameMock(GAME_STATUS.playing);
      const validatePreparingCommand = validateRequiredGameStatus(playingGame, playingCommand);
      expect(validatePreparingCommand).toBe(true);
      const validatePlayingCommand = validateRequiredGameStatus(preparingGame, preparingCommand);
      expect(validatePlayingCommand).toBe(true);
    });
  });

  describe('validateGamemasterOnly()', () => {
    test('should return a boolean.', () => {
      const game = createGameMock();
      const command = new CommandMock('cmd');
      const validation = validateGamemasterOnly(game, command);
      expect(typeof validation).toBe('boolean');
    });

    test('should return true if command is not limited to gamemaster only.', () => {
      const game = createGameMock();
      const notGamemasterOnlyCommand = new CommandMock('cmd', false);
      const validation = validateGamemasterOnly(game, notGamemasterOnlyCommand, '234');
      expect(validation).toBe(true);
    });

    test('should return true if command is limited to gamemaster only and author is gamemaster.', () => {
      const game = createGameMock();
      const gamemasterOnlyCommand = new CommandMock('cmd', true);
      const validation = validateGamemasterOnly(game, gamemasterOnlyCommand, '123');
      expect(validation).toBe(true);
    });

    test("should return false if command is limited to gamemaster only and author isn't gamemaster.", () => {
      const game = createGameMock();
      const gamemasterOnlyCommand = new CommandMock('cmd', true);
      const validation = validateGamemasterOnly(game, gamemasterOnlyCommand, '23124');
      expect(validation).toBe(false);
    });

    test('should return false if command is limited to gamemaster only and no game is running.', () => {
      const gamemasterOnlyCommand = new CommandMock('cmd', true);
      const validation = validateGamemasterOnly(undefined, gamemasterOnlyCommand, '123');
      expect(validation).toBe(false);
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
