const sinon = require('sinon');
const Game = require('./Game');
const Player = require('./Player');
const { GAME_STATUS } = require('../common/constants');

const GuildMemberMock = {
  displayName: 'moonstar-x',
  id: 3000
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
    id
  };
}

describe('Classes: Game', () => {
  test('should create a Game instance.', () => {
    const game = new Game(GuildMemberMock);
    expect(game).toBeInstanceOf(Game);
  });

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

  test('should add players to player list.', () => {
    const game = new Game(GuildMemberMock);
    const newMember1 = createGuildMemberMock();
    game.addPlayer(newMember1);
    expect(game.players.length).toEqual(2);
    const newMember2 = createGuildMemberMock();
    game.addPlayer(newMember2);
    expect(game.players.length).toEqual(3);
    for (const player of game.players) {
      expect(player).toBeInstanceOf(Player);
    }
  });

  test('should throw if player added is already in list.', () => {
    const game = new Game(GuildMemberMock);
    const newMember = createGuildMemberMock();
    game.addPlayer(newMember);
    expect(() => game.addPlayer(newMember)).toThrow();
  });

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
    game.leavePlayer(players[0].id);
    expect(game.players.length).toEqual(2);
    game.leavePlayer(players[1].id);
    expect(game.players.length).toEqual(1);
  });

  test('should remove a player from the game.', () => {
    const gamemaster = GuildMemberMock;
    const game = new Game(gamemaster);
    const newMember = createGuildMemberMock();
    game.addPlayer(new Player(newMember));
    const removePlayer = game._removePlayer(game.players[0], 0);
    expect(removePlayer).toEqual(true);
  });

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

  test('should find player and index by name.', () => {
    const gamemaster = GuildMemberMock;
    const game = new Game(gamemaster);
    const gamemasterInfo = game._findPlayerByName(gamemaster.displayName);
    expect(gamemasterInfo.playerIndex).toBeLessThan(game.players.length);
    expect(gamemasterInfo.player).toMatchObject(game.players[0]);
  });

  test('should find player and index by id.', () => {
    const gamemaster = GuildMemberMock;
    const game = new Game(gamemaster);
    const gamemasterInfo = game._findPlayerById(gamemaster.id);
    expect(gamemasterInfo.playerIndex).toBeLessThan(game.players.length);
    expect(gamemasterInfo.player).toMatchObject(game.players[0]);
  });

  test('should verify player is in the list.', () => {
    const gamemaster = GuildMemberMock;
    const game = new Game(gamemaster);
    const isPlayerInList = game._isPlayerInList(gamemaster);
    expect(isPlayerInList).toEqual(true);
  });
});
