const Player = require('./Player.js');

const GuildMemberMock = {
  displayName: 'moonstar-x',
  id: 69
};

describe('Classes: Player', () => {
  test('should get name.', () => {
    const player = new Player(GuildMemberMock);
    expect(player.name).toEqual(GuildMemberMock.displayName);
  });

  test('should get id.', () => {
    const player = new Player(GuildMemberMock);
    expect(player.id).toEqual(GuildMemberMock.id);
  });

  test('should get member.', () => {
    const player = new Player(GuildMemberMock);
    expect(player.member).toMatchObject(GuildMemberMock);
  });

  test('should get gamemaster.', () => {
    const gamemaster = new Player(GuildMemberMock, true);
    const regularPlayer = new Player(GuildMemberMock);
    expect(gamemaster.isGamemaster).toEqual(true);
    expect(regularPlayer.isGamemaster).toEqual(false);
  });

  test('should get score.', () => {
    const player = new Player(GuildMemberMock);
    expect(player.score).toEqual(0);
  });

  test('should increment score by 1.', () => {
    const player = new Player(GuildMemberMock);
    const score = player.incrementScore();
    expect(score).toEqual(player.score);
  });

  test('should not set name.', () => {
    const player = new Player(GuildMemberMock);
    player.name = 'minibambu';
    expect(player.name).toEqual(GuildMemberMock.displayName);
  });

  test('should not set id.', () => {
    const player = new Player(GuildMemberMock);
    player.id = 100;
    expect(player.id).toEqual(GuildMemberMock.id);
  });

  test('should not set member.', () => {
    const player = new Player(GuildMemberMock);
    const GuildMemberMockTwo = {
      displayName: 'RestInPizzeria',
      id: 22
    };
    player.member = GuildMemberMockTwo;
    expect(player.member).toMatchObject(GuildMemberMock);
  });

  test('should set gamemaster.', () => {
    const gamemaster = new Player(GuildMemberMock, true);
    const regularPlayer = new Player(GuildMemberMock);
    gamemaster.isGamemaster = false;
    regularPlayer.isGamemaster = true;
    expect(gamemaster.isGamemaster).toEqual(false);
    expect(regularPlayer.isGamemaster).toEqual(true);
  });

  test('should not set gamemaster if value is not boolean.', () => {
    const gamemaster = new Player(GuildMemberMock, true);
    gamemaster.isGamemaster = 22;
    expect(gamemaster.isGamemaster).toEqual(true);
    gamemaster.isGamemaster = '22';
    expect(gamemaster.isGamemaster).toEqual(true);
  });

  test('should not set score.', () => {
    const player = new Player(GuildMemberMock);
    player.score = 22;
    expect(player.score).toEqual(0);
  });
});
