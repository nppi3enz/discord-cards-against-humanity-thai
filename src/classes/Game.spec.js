const sinon = require('sinon');
const Game = require('./Game');
const Player = require('./Player');
const { GAME_STATUS } = require('../common/constants');
const { createGuildMemberMock } = require('../../__mocks__/guildMemberMock');
const GuildMock = require('../../__mocks__/guildMock');
const { GameStatusError, PlayerError, GameRequirementsError, GamePlayersError } = require('./Errors');

describe('Classes: Game', () => {
  let game;
  let gamemasterMember;

  beforeEach(() => {
    gamemasterMember = createGuildMemberMock();
    game = new Game(gamemasterMember);
  });

  test('should create a Game instance.', () => {
    expect(game).toBeInstanceOf(Game);
  });

  describe('Getters and Setters:', () => {
    test('should get gamemaster player object.', () => {
      expect(game.gamemaster).toBeInstanceOf(Player);
      expect(game.gamemaster.isGamemaster).toEqual(true);
      const gamemaster = new Player(gamemasterMember, true);
      expect(game.gamemaster).toEqual(expect.objectContaining(gamemaster));
    });

    test('should not set gamemaster.', () => {
      const newGamemaster = 'new gamemaster';
      game.gamemaster = newGamemaster;
      expect(game.gamemaster).not.toEqual(newGamemaster);
    });

    test('should get player list.', () => {
      expect(game.players).toBeInstanceOf(Array);
      for (const player of game.players) {
        expect(player).toBeInstanceOf(Player);
      }
    });

    test('first member of player list should be gamemaster.', () => {
      expect(game.players.length).toEqual(1);
      expect(game.players[0]).toEqual(expect.objectContaining(game.gamemaster));
    });

    test('should not set player list.', () => {
      const newPlayers = 'new players';
      game.players = newPlayers;
      expect(game.players).toBeInstanceOf(Array);
      expect(game.players).not.toEqual(newPlayers);
    });

    test('should get game status.', () => {
      expect(game.status).toEqual(GAME_STATUS.preparing);
    });

    test('should not set game status.', () => {
      const newGameStatus = GAME_STATUS.finished;
      game.status = newGameStatus;
      expect(game.status).toEqual(GAME_STATUS.preparing);
      expect(game.status).not.toEqual(newGameStatus);
    });

    test('should get game guild.', () => {
      expect(game.guild).toEqual(expect.objectContaining(GuildMock));
    });

    test('should not set game guild.', () => {
      game.guild = 'new guild';
      expect(game.guild).toBeInstanceOf(Object);
      expect(game.guild).toEqual(expect.objectContaining(GuildMock));
    });
  });

  describe('Events:', () => {
    const event = 'event';
    const spy = sinon.spy();

    beforeEach(() => {
      spy.resetHistory();
      game.once(event, spy);
    });

    test('should invoke event callbacks.', () => {
      expect(spy.notCalled).toEqual(true);
      game.emit(event);
      expect(spy.called).toEqual(true);
    });

    test('should pass arguments to the callbacks.', () => {
      const arg1 = 'Foo';
      const arg2 = ['Bar'];
      const arg3 = { foobar: 'Foobar' };
      game.emit(event, arg1, arg2, arg3);
      expect(spy.calledOnce).toEqual(true);
      expect(spy.calledWithExactly(arg1, arg2, arg3)).toEqual(true);
    });
  });

  describe('Public Methods:', () => {
    let playerMembers;

    beforeEach(() => {
      playerMembers = [];
      for (let i = 0; i < 2; i++) {
        const member = createGuildMemberMock();
        playerMembers.push(member);
        game.addPlayer(member);
      }
    });

    describe('addPlayer()', () => {
      test('should add players to player list and return the player object.', () => {
        const game = new Game(createGuildMemberMock());
        expect(game.players.length).toEqual(1);
        const addedPlayer1 = game.addPlayer(createGuildMemberMock());
        expect(game.players.length).toEqual(2);
        const addedPlayer2 = game.addPlayer(createGuildMemberMock());
        expect(game.players.length).toEqual(3);
        for (const player of game.players) {
          expect(player).toBeInstanceOf(Player);
        }
        expect(addedPlayer1).toBeInstanceOf(Player);
        expect(addedPlayer2).toBeInstanceOf(Player);
      });

      test('should throw a PlayerError if player added is already in list.', () => {
        const newMember = createGuildMemberMock();
        game.addPlayer(newMember);
        expect(() => game.addPlayer(newMember)).toThrow(PlayerError);
      });
    });

    /*
      TODO: We should check that this function will throw if the number of players in game is less than 3 after
        kicking someone, the game should end.
    */
    describe('kickPlayer()', () => {
      test('should kick players by name.', () => {
        expect(game.players.length).toEqual(3);
        game.kickPlayer(playerMembers[0].displayName);
        expect(game.players.length).toEqual(2);
        game.kickPlayer(playerMembers[1].displayName);
        expect(game.players.length).toEqual(1);
      });

      test('should throw a GamePlayersError if trying to kick the gamemaster.', () => {
        expect(() => game.kickPlayer(gamemasterMember.displayName)).toThrow(GamePlayersError);
      });

      test('should send a message to kickedPlayer and remove its game reference.', () => {
        const playerToKick = game.addPlayer(createGuildMemberMock());
        const kickedPlayer = game.kickPlayer(playerToKick.name);
        expect(kickedPlayer.member.send.mock.calls.length).toBe(1);
        expect(kickedPlayer.member.user.game).toBeNull();
      });
    });

    describe('removePlayer()', () => {
      test('should remove players that leave the game.', () => {
        expect(game.players.length).toEqual(3);
        game.removePlayer(playerMembers[0].id);
        expect(game.players.length).toEqual(2);
        game.removePlayer(playerMembers[1].id);
        expect(game.players.length).toEqual(1);
      });
    });

    describe('start()', () => {
      test("should start game if there's 3 or more players, else a GameRequirementsError should throw.", () => {
        const game = new Game(createGuildMemberMock());
        expect(() => game.start()).toThrow(GameRequirementsError);
        game.addPlayer(createGuildMemberMock());
        expect(() => game.start()).toThrow(GameRequirementsError);
        game.addPlayer(createGuildMemberMock());
        expect(() => {
          const gameStarted = game.start();
          expect(gameStarted).toEqual(true);
        }).not.toThrow();
      });

      test('should change game status to playing if started.', () => {
        game.start();
        expect(game.status).toEqual(GAME_STATUS.playing);
      });

      test('should throw a GameStatusError if trying to start an already on-going game.', () => {
        game.start();
        expect(() => game.start()).toThrow(GameStatusError);
      });
    });

    describe('end()', () => {
      test('should change game status to finished if stopped.', () => {
        game.start();
        game.end();
        expect(game.status).toEqual(GAME_STATUS.finished);
      });

      test('should change game property of guild to null.', () => {
        game.start();
        game.end();
        expect(game.guild.game).toBeNull();
      });

      test('should change each member game reference to null.', () => {
        game.start();
        game.end();
        for (const player of game.players) {
          expect(player.member.user.game).toBeNull();
        }
      });

      test('should send a message to all players if game was being prepared.', () => {
        game.end();
        for (const player of game.players) {
          expect(player.member.send.mock.calls.length).toBe(1);
        }
      });

      test('should send message and scoreboard to all players if game was being played.', () => {
        game.start();
        game.end();
        for (const player of game.players) {
          expect(player.member.send.mock.calls.length).toBe(2);
        }
      });
    });

    describe('getPlayersLabel()', () => {
      test('should return a string.', () => {
        const label = game.getPlayersLabel();
        expect(typeof label).toBe('string');
      });

      test('should return a label with the structure [playersInGame/maxPlayers].', () => {
        const label = game.getPlayersLabel();
        expect(label).toBe('[3/10]');
        game.removePlayer(playerMembers[0].id);
        const newLabel = game.getPlayersLabel();
        expect(newLabel).toBe('[2/10]');
      });
    });

    describe('broadcastToPlayers()', () => {
      const message = 'my message';

      test('should send a message to all players in-game.', () => {
        game.broadcastToPlayers(message);
        for (const player of game.players) {
          expect(player.member.send.mock.calls.length).toBe(1);
          expect(player.member.send.mock.calls).toEqual([[message]]);
        }
      });

      test('should send a message to all players in-game except to a playerNotToMessage.', () => {
        const newPlayer = game.addPlayer(createGuildMemberMock());
        game.broadcastToPlayers(message, newPlayer);
        for (const player of game.players) {
          if (newPlayer.id === player.id) {
            expect(player.member.send.mock.calls.length).toBe(0);
            continue;
          }
          expect(player.member.send.mock.calls.length).toBe(1);
          expect(player.member.send.mock.calls).toEqual([[message]]);
        }
      });
    });

    describe('getScoreboard()', () => {
      test('should throw a GameStatusError if trying to get the scoreboard in a non playing game.', () => {
        expect(() => game.getScoreboard()).toThrow(GameStatusError);
        expect(() => {
          game.start();
          game.getScoreboard();
        }).not.toThrow();
      });

      test('should get the scoreboard as an array of objects.', () => {
        game.start();
        const scoreboard = game.getScoreboard();
        expect(scoreboard).toBeInstanceOf(Array);
        for (const playerScore of scoreboard) {
          expect(playerScore).toBeInstanceOf(Object);
          expect(playerScore).toHaveProperty('name');
          expect(playerScore).toHaveProperty('id');
          expect(playerScore).toHaveProperty('score');
          expect(typeof playerScore.name).toBe('string');
          expect(typeof playerScore.id).toBe('string');
          expect(typeof playerScore.score).toBe('number');
        }
      });

      test('should scoreboard length and player list length be equal.', () => {
        game.start();
        expect(game.getScoreboard().length).toBe(game.players.length);
      });

      test('should get scoreboard and correspond to the current score of each player.', () => {
        game.start();
        const initialScoreboard = game.getScoreboard();
        for (const playerScore of initialScoreboard) {
          expect(playerScore.score).toBe(0);
        }
        for (const player of game.players) {
          player.incrementScore();
        }
        const updatedScoreboard = game.getScoreboard();
        for (const playerScore of updatedScoreboard) {
          expect(playerScore.score).toBe(1);
        }
      });
    });
  });

  describe('Private Methods:', () => {
    let playerMembers;

    beforeEach(() => {
      playerMembers = [];
      for (let i = 0; i < 2; i++) {
        const member = createGuildMemberMock();
        playerMembers.push(member);
        game.addPlayer(member);
      }
    });

    describe('_removePlayerFromGame()', () => {
      test('should remove player from the game and return this player.', () => {
        const addedPlayer = game.addPlayer(createGuildMemberMock());
        const playerIndex = game.players.length - 1;
        const removedPlayer = game._removePlayerFromGame(game.players[playerIndex], playerIndex);
        expect(removedPlayer).toBeInstanceOf(Player);
        expect(removedPlayer.id).toEqual(addedPlayer.id);
        expect(game.players.length).toEqual(3);
      });

      test('should reassign gamemaster if gamemaster is removed from the game.', () => {
        const { gamemaster } = game;
        const removedPlayer = game._removePlayerFromGame(gamemaster, 0); // here we removed the gamemaster.
        expect(removedPlayer.id).toEqual(gamemaster.id);
        expect(game.players.length).toEqual(2);
        expect(game.gamemaster).toBeInstanceOf(Player);
      });

      /*
        TODO: This method should be removed in the future.
      */
      test('should end the game abruptly if game was being played and the resulting number of players is less than 3.', () => {
        game._endAbruptly = jest.fn();
        game.start();
        expect(game._endAbruptly.mock.calls.length).toBe(0);
        game._removePlayerFromGame(game.players[1], 1);
        expect(game._endAbruptly.mock.calls.length).toBe(1);
      });

      test('should not end the game abruptly if game was being prepared and the resulting number of players is less than 3.', () => {
        game._endAbruptly = jest.fn();
        expect(game._endAbruptly.mock.calls.length).toBe(0);
        game._removePlayerFromGame(game.players[1], 1);
        expect(game._endAbruptly.mock.calls.length).toBe(0);
      });
    });

    describe('_chooseRandomPlayer()', () => {
      test('should choose a random player in the game.', () => {
        const randomPlayer = game._chooseRandomPlayer();
        expect(randomPlayer).toBeInstanceOf(Player);
      });
    });

    describe('_findPlayerByName()', () => {
      test('should find player and player list index by name.', () => {
        const foundGamemaster = game._findPlayerByName(gamemasterMember.displayName);
        expect(foundGamemaster.playerIndex).toBeGreaterThan(-1); // a -1 or lower means the player was not found.
        expect(foundGamemaster.player).toEqual(expect.objectContaining(game.gamemaster));
      });
    });

    describe('_findPlayerById()', () => {
      test('should find player and player list index by id.', () => {
        const foundGamemaster = game._findPlayerById(gamemasterMember.id);
        expect(foundGamemaster.playerIndex).toBeGreaterThan(-1);
        expect(foundGamemaster.player).toEqual(expect.objectContaining(game.gamemaster));
      });
    });

    describe('_isPlayerInList()', () => {
      test('should verify if player is in the list.', () => {
        const isGamemasterInList = game._isPlayerInList(gamemasterMember);
        expect(isGamemasterInList).toEqual(true);
        const playerNotInGame = new Player(createGuildMemberMock());
        expect(game._isPlayerInList(playerNotInGame)).toEqual(false);
      });
    });
  });
});
