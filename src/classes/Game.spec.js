const sinon = require('sinon');
const Game = require('./Game');
const Player = require('./Player');
const { GAME_STATUS } = require('../common/constants');
const { GameStatusError, PlayerError, GameRequirementsError, GamePlayersError } = require('./Errors');

const GuildMock = {
  name: 'My Server',
  id: 172937192
};

const GuildMemberMock = {
  displayName: 'moonstar-x',
  id: 3000,
  guild: GuildMock,
  send: jest.fn(),
  user: {
    game: 'game instance'
  }
};

const usernames = [
  'cody',
  'tanb01',
  'minimabu',
  'Rest In Pizzeria',
  'papishampu'
];

let incrementalId = 1;
function createGuildMemberMock() {
  const user = usernames[Math.floor(Math.random() * usernames.length)];
  const id = incrementalId;
  incrementalId++;

  return {
    displayName: user,
    id,
    guild: GuildMock,
    send: jest.fn(),
    user: {
      game: 'game instance'
    }
  };
}

describe('Classes: Game', () => {
  test('should create a Game instance.', () => {
    const game = new Game(GuildMemberMock);
    expect(game).toBeInstanceOf(Game);
  });

  describe('Getters and Setters:', () => {
    test('should get gamemaster player object.', () => {
      const game = new Game(GuildMemberMock);
      expect(game.gamemaster).toBeInstanceOf(Player);
      expect(game.gamemaster.isGamemaster).toEqual(true);
      const gamemaster = new Player(GuildMemberMock, true);
      expect(game.gamemaster).toMatchObject(gamemaster);
    });

    test('should not set gamemaster.', () => {
      const game = new Game(GuildMemberMock);
      const newGamemaster = 'new gamemaster';
      game.gamemaster = newGamemaster;
      expect(game.gamemaster).not.toEqual(newGamemaster);
    });

    test('should get player list.', () => {
      const game = new Game(GuildMemberMock);
      expect(game.players).toBeInstanceOf(Array);
      for (const player of game.players) {
        expect(player).toBeInstanceOf(Player);
      }
    });

    test('first member of player list should be gamemaster.', () => {
      const game = new Game(GuildMemberMock);
      expect(game.players.length).toEqual(1);
      expect(game.players[0]).toMatchObject(game.gamemaster);
    });

    test('should not set player list.', () => {
      const game = new Game(GuildMemberMock);
      const newPlayers = 'new players';
      game.players = newPlayers;
      expect(game.players).toBeInstanceOf(Array);
      expect(game.players).not.toEqual(newPlayers);
    });

    test('should get game status.', () => {
      const game = new Game(GuildMemberMock);
      expect(game.status).toEqual(GAME_STATUS.preparing);
    });

    test('should not set game status.', () => {
      const game = new Game(GuildMemberMock);
      const newGameStatus = GAME_STATUS.finished;
      game.status = newGameStatus;
      expect(game.status).toEqual(GAME_STATUS.preparing);
      expect(game.status).not.toEqual(newGameStatus);
    });

    test('should get game guild.', () => {
      const game = new Game(GuildMemberMock);
      expect(game.guild).toMatchObject(GuildMock);
    });

    test('should not set game guild.', () => {
      const game = new Game(GuildMemberMock);
      game.guild = 'new guild';
      expect(game.guild).toMatchObject(GuildMock);
      expect(game.guild).not.toBeInstanceOf(String);
      expect(game.guild).toBeInstanceOf(Object);
    });
  });

  describe('Events:', () => {
    test('should invoke event callbacks.', () => {
      const game = new Game(GuildMemberMock);
      const event = 'event';
      const spy = sinon.spy();
      game.on(event, spy);
      expect(spy.notCalled).toEqual(true);
      game.emit(event);
      expect(spy.called).toEqual(true);
    });

    test('should pass arguments to the callbacks.', () => {
      const game = new Game(GuildMemberMock);
      const event = 'event';
      const arg1 = 'Foo';
      const arg2 = ['Bar'];
      const arg3 = { foobar: 'Foobar' };
      const spy = sinon.spy();
      game.on(event, spy);
      game.emit(event, arg1, arg2, arg3);
      expect(spy.calledOnce).toEqual(true);
      expect(spy.calledWithExactly(arg1, arg2, arg3)).toEqual(true);
    });
  });

  describe('Public Methods:', () => {
    describe('addPlayer()', () => {
      test('should add players to player list and return the player object.', () => {
        const game = new Game(GuildMemberMock);
        const newMember1 = createGuildMemberMock();
        const addedPlayer1 = game.addPlayer(newMember1);
        expect(game.players.length).toEqual(2);
        const newMember2 = createGuildMemberMock();
        const addedPlayer2 = game.addPlayer(newMember2);
        expect(game.players.length).toEqual(3);
        for (const player of game.players) {
          expect(player).toBeInstanceOf(Player);
        }
        expect(addedPlayer1).toBeInstanceOf(Player);
        expect(addedPlayer2).toBeInstanceOf(Player);
      });

      test('should throw a PlayerError if player added is already in list.', () => {
        const game = new Game(GuildMemberMock);
        const newMember = createGuildMemberMock();
        game.addPlayer(newMember);
        expect(() => game.addPlayer(newMember)).toThrow(PlayerError);
      });
    });

    describe('kickPlayer()', () => {
      test('should kick players by name.', () => {
        const gamemaster = GuildMemberMock;
        const game = new Game(gamemaster);
        const players = [];
        for (let i = 0; i < 2; i++) {
          const newMember = createGuildMemberMock();
          players.push(new Player(newMember));
          game.addPlayer(newMember);
        }
        expect(game.players.length).toEqual(3);
        game.kickPlayer(players[0].name);
        expect(game.players.length).toEqual(2);
        game.kickPlayer(players[1].name);
        expect(game.players.length).toEqual(1);
      });

      test('should throw a GamePlayersError if trying to kick the gamemaster.', () => {
        const gamemaster = GuildMemberMock;
        const game = new Game(gamemaster);
        for (let i = 0; i < 2; i++) {
          game.addPlayer(createGuildMemberMock());
        }
        expect(() => game.kickPlayer(gamemaster.displayName)).toThrow(GamePlayersError);
      });

      test('should send a message to kickedPlayer and remove its game reference.', () => {
        const game = new Game(GuildMemberMock);
        for (let i = 0; i < 3; i++) {
          game.addPlayer(createGuildMemberMock());
        }
        const playerToKick = game.addPlayer(createGuildMemberMock());
        const kickedPlayer = game.kickPlayer(playerToKick.name);
        expect(kickedPlayer.member.send.mock.calls.length).toBe(1);
        expect(kickedPlayer.member.user.game).toBeNull();
      });
    });

    describe('removePlayer()', () => {
      test('should remove players that leave the game.', () => {
        const gamemaster = GuildMemberMock;
        const game = new Game(gamemaster);
        const players = [];
        for (let i = 0; i < 2; i++) {
          const newMember = createGuildMemberMock();
          players.push(new Player(newMember));
          game.addPlayer(newMember);
        }
        expect(game.players.length).toEqual(3);
        game.removePlayer(players[0].id);
        expect(game.players.length).toEqual(2);
        game.removePlayer(players[1].id);
        expect(game.players.length).toEqual(1);
      });
    });

    describe('start()', () => {
      test("should start game if there's 3 or more players, else a GameRequirementsError should throw.", () => {
        const game = new Game(GuildMemberMock);
        const newMember = createGuildMemberMock();
        game.addPlayer(newMember);
        expect(() => game.start()).toThrow(GameRequirementsError);
        const newMember2 = createGuildMemberMock();
        game.addPlayer(newMember2);
        const gameStarted = game.start();
        expect(() => gameStarted).not.toThrow();
        expect(gameStarted).toEqual(true);
      });

      test('should change game status to playing if started.', () => {
        const game = new Game(GuildMemberMock);
        for (let i = 0; i < 2; i++) {
          game.addPlayer(createGuildMemberMock());
        }
        game.start();
        expect(game.status).toEqual(GAME_STATUS.playing);
      });

      test('should throw a GameStatusError if trying to start an already on-going game.', () => {
        const game = new Game(GuildMemberMock);
        for (let i = 0; i < 2; i++) {
          game.addPlayer(createGuildMemberMock());
        }
        game.start();
        expect(() => game.start()).toThrow(GameStatusError);
      });
    });

    describe('end()', () => {
      beforeEach(() => {
        GuildMemberMock.send.mockClear();
      });

      test('should change game status to finished if stopped.', () => {
        const game = new Game(GuildMemberMock);
        for (let i = 0; i < 2; i++) {
          game.addPlayer(createGuildMemberMock());
        }
        game.start();
        game.end();
        expect(game.status).toEqual(GAME_STATUS.finished);
      });

      test('should change game property of guild to null.', () => {
        const game = new Game(GuildMemberMock);
        for (let i = 0; i < 2; i++) {
          game.addPlayer(createGuildMemberMock());
        }
        game.start();
        game.end();
        expect(game.guild.game).toBeNull();
      });

      test('should change each member game reference to null.', () => {
        const game = new Game(GuildMemberMock);
        for (let i = 0; i < 2; i++) {
          game.addPlayer(createGuildMemberMock());
        }
        game.start();
        game.end();
        for (const player of game.players) {
          expect(player.member.user.game).toBeNull();
        }
      });

      test('should send a message to all players if game was being prepared.', () => {
        const game = new Game(GuildMemberMock);
        for (let i = 0; i < 2; i++) {
          game.addPlayer(createGuildMemberMock());
        }
        game.end();
        for (const player of game.players) {
          expect(player.member.send.mock.calls.length).toBe(1);
        }
      });

      test('should send message and scoreboard to all players if game was being played.', () => {
        const game = new Game(GuildMemberMock);
        for (let i = 0; i < 2; i++) {
          game.addPlayer(createGuildMemberMock());
        }
        game.start();
        game.end();
        for (const player of game.players) {
          expect(player.member.send.mock.calls.length).toBe(2);
        }
      });
    });

    describe('getPlayersLabel()', () => {
      test('should return a string.', () => {
        const game = new Game(GuildMemberMock);
        for (let i = 0; i < 2; i++) {
          game.addPlayer(createGuildMemberMock());
        }
        game.start();
        const label = game.getPlayersLabel();
        expect(typeof label).toBe('string');
      });

      test('should return a label with the structure [playersInGame/maxPlayers].', () => {
        const game = new Game(GuildMemberMock);
        for (let i = 0; i < 4; i++) {
          game.addPlayer(createGuildMemberMock());
        }
        game.start();
        const label = game.getPlayersLabel();
        expect(label).toBe('[5/10]');
        game.removePlayer(3000);
        const newLabel = game.getPlayersLabel();
        expect(newLabel).toBe('[4/10]');
      });
    });

    describe('broadcastToPlayers()', () => {
      beforeEach(() => {
        GuildMemberMock.send.mockClear();
      });

      test('should send a message to all players in-game.', () => {
        const game = new Game(GuildMemberMock);
        for (let i = 0; i < 2; i++) {
          game.addPlayer(createGuildMemberMock());
        }
        game.broadcastToPlayers('my message');
        for (const player of game.players) {
          expect(player.member.send.mock.calls.length).toBe(1);
          expect(player.member.send.mock.calls).toEqual([['my message']]);
        }
      });

      test('should send a message to all players in-game except to new player.', () => {
        const game = new Game(GuildMemberMock);
        for (let i = 0; i < 2; i++) {
          game.addPlayer(createGuildMemberMock());
        }
        const newPlayer = game.addPlayer(createGuildMemberMock());
        game.broadcastToPlayers('my message', newPlayer);
        for (const player of game.players) {
          if (newPlayer.id === player.id) {
            expect(player.member.send.mock.calls.length).toBe(0);
            continue;
          }
          expect(player.member.send.mock.calls.length).toBe(1);
          expect(player.member.send.mock.calls).toEqual([['my message']]);
        }
      });
    });

    test('should get the scoreboard as an array of objects.', () => {
      const game = new Game(GuildMemberMock);
      for (let i = 0; i < 2; i++) {
        game.addPlayer(createGuildMemberMock());
      }
      game.start();
      const scoreboard = game.getScoreboard();
      expect(scoreboard).toBeInstanceOf(Array);
      for (const playerScore of scoreboard) {
        expect(playerScore).toBeInstanceOf(Object);
        expect(playerScore).toHaveProperty('name');
        expect(playerScore).toHaveProperty('id');
        expect(playerScore).toHaveProperty('score');
        expect(typeof playerScore.name).toBe('string');
        expect(typeof playerScore.score).toBe('number');
      }
    });

    test('should throw a GameStatusError if trying to get the scoreboard in a non playing game.', () => {
      const game = new Game(GuildMemberMock);
      for (let i = 0; i < 2; i++) {
        game.addPlayer(createGuildMemberMock());
      }
      expect(() => game.getScoreboard()).toThrow(GameStatusError);
      game.start();
      expect(() => game.getScoreboard()).not.toThrow();
    });

    test('should scoreboard length and player list length be equal.', () => {
      const game = new Game(GuildMemberMock);
      for (let i = 0; i < 2; i++) {
        game.addPlayer(createGuildMemberMock());
      }
      game.start();
      expect(game.getScoreboard().length).toBe(game.players.length);
    });

    test('should get scoreboard and correspond to the current score of each player.', () => {
      const game = new Game(GuildMemberMock);
      for (let i = 0; i < 2; i++) {
        game.addPlayer(createGuildMemberMock());
      }
      game.start();
      const initialScoreboard = game.getScoreboard();
      for (const playerScore of initialScoreboard) {
        expect(playerScore.score).toBe(0);
        const foundPlayer = game._findPlayerById(playerScore.id).player;
        expect(foundPlayer).toBeInstanceOf(Player);
        expect(foundPlayer.name).toBe(playerScore.name);
      }
      for (let i = 0; i < game.players; i++) {
        for (let j = 0; j < i + 1; j++) {
          game.players[i].incrementScore();
        }
      }
      const updatedScoreboard = game.getScoreboard();
      for (const playerScore of updatedScoreboard) {
        const foundPlayer = game._findPlayerById(playerScore.id).player;
        expect(playerScore.score).toBe(foundPlayer.score);
      }
    });
  });

  describe('Private Methods:', () => {
    describe('_removePlayerFromGame()', () => {
      test('should remove player from the game and return this player.', () => {
        const game = new Game(GuildMemberMock);
        const newMember = createGuildMemberMock();
        for (let i = 0; i < 3; i++) {
          game.addPlayer(createGuildMemberMock());
        }
        const addedPlayer = game.addPlayer(newMember);
        const playerIndex = game.players.length - 1;
        const removedPlayer = game._removePlayerFromGame(game.players[playerIndex], playerIndex);
        expect(removedPlayer).toBeInstanceOf(Player);
        expect(removedPlayer.id).toEqual(addedPlayer.id);
        expect(game.players.length).toEqual(4);
      });

      test('should reassign gamemaster if gamemaster is removed from the game.', () => {
        const gamemaster = GuildMemberMock;
        const game = new Game(gamemaster);
        const gamemasterPlayer = new Player(gamemaster, true);
        for (let i = 0; i < 3; i++) {
          game.addPlayer(createGuildMemberMock());
        }
        const gamemasterIndex = 0;
        const removedPlayer = game._removePlayerFromGame(game.players[gamemasterIndex], gamemasterIndex); // here we removed the gamemaster.
        expect(removedPlayer.id).toEqual(gamemasterPlayer.id);
        expect(game.players.length).toEqual(3);
        expect(game.gamemaster).toBeInstanceOf(Player);
      });

      test('should end the game abruptly if game was being played and the resulting number of players is less than 3.', () => {
        const gamemaster = GuildMemberMock;
        const game = new Game(gamemaster);
        game._endAbruptly = jest.fn();
        for (let i = 0; i < 2; i++) {
          game.addPlayer(createGuildMemberMock());
        }
        game.start();
        expect(game._endAbruptly.mock.calls.length).toBe(0);
        game._removePlayerFromGame(game.players[1], 1);
        expect(game._endAbruptly.mock.calls.length).toBe(1);
      });

      test('should not end the game abruptly if game was being prepared and the resulting number of players is less than 3.', () => {
        const gamemaster = GuildMemberMock;
        const game = new Game(gamemaster);
        game._endAbruptly = jest.fn();
        for (let i = 0; i < 2; i++) {
          game.addPlayer(createGuildMemberMock());
        }
        expect(game._endAbruptly.mock.calls.length).toBe(0);
        game._removePlayerFromGame(game.players[1], 1);
        expect(game._endAbruptly.mock.calls.length).toBe(0);
      });
    });

    describe('_chooseRandomPlayer()', () => {
      test('should choose a random player in the game.', () => {
        const gamemaster = GuildMemberMock;
        const game = new Game(gamemaster);
        for (let i = 0; i < 2; i++) {
          const newMember = createGuildMemberMock();
          game.addPlayer(newMember);
        }
        const aRandomPlayer = game._chooseRandomPlayer();
        expect(aRandomPlayer).toBeInstanceOf(Player);
      });
    });

    describe('_findPlayerByName()', () => {
      test('should find player and player list index by name.', () => {
        const gamemaster = GuildMemberMock;
        const game = new Game(gamemaster);
        const foundGamemasterObject = game._findPlayerByName(gamemaster.displayName);
        expect(foundGamemasterObject.playerIndex).toBeGreaterThan(-1); // a -1 or lower means the player was not found.
        expect(foundGamemasterObject.player).toMatchObject(game.gamemaster);
      });
    });

    describe('_findPlayerById()', () => {
      test('should find player and player list index by id.', () => {
        const gamemaster = GuildMemberMock;
        const game = new Game(gamemaster);
        const foundGamemasterObject = game._findPlayerById(gamemaster.id);
        expect(foundGamemasterObject.playerIndex).toBeGreaterThan(-1);
        expect(foundGamemasterObject.player).toMatchObject(game.gamemaster);
      });
    });

    describe('_isPlayerInList()', () => {
      test('should verify if player is in the list.', () => {
        const gamemaster = GuildMemberMock;
        const game = new Game(gamemaster);
        const isGamemasterInList = game._isPlayerInList(gamemaster);
        expect(isGamemasterInList).toEqual(true);
        const randomPlayer = new Player(createGuildMemberMock());
        expect(game._isPlayerInList(randomPlayer)).toEqual(false);
      });
    });
  });
});
