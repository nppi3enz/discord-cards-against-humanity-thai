const sinon = require('sinon');
const Game = require('./Game');
const Player = require('./Player');
const { GAME_STATUS } = require('../common/constants');

const GuildMemberMock = {
  displayName: 'moonstar-x',
  id: 69
};

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
});
