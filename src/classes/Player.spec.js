const Player = require('./Player.js');
const { createGuildMemberMock } = require('../../__mocks__/guildMemberMock');

describe('Classes: Player', () => {
  let player;
  let member;

  beforeEach(() => {
    member = createGuildMemberMock();
    player = new Player(member);
  });

  test('should create a player instance.', () => {
    expect(player).toBeInstanceOf(Player);
  });

  describe('Getters and Setters:', () => {
    test('should get name.', () => {
      expect(player.name).toEqual(member.displayName);
    });

    test('should get id.', () => {
      expect(player.id).toEqual(member.id);
    });

    test('should get member.', () => {
      expect(player.member).toMatchObject(member);
    });

    test('should get gamemaster.', () => {
      const gamemaster = new Player(createGuildMemberMock(), true);
      const regularPlayer = new Player(createGuildMemberMock());
      expect(gamemaster.isGamemaster).toEqual(true);
      expect(regularPlayer.isGamemaster).toEqual(false);
    });

    test('should get score.', () => {
      expect(player.score).toEqual(0);
    });

    test('should not set name.', () => {
      player.name = 'new player name';
      expect(player.name).toEqual(member.displayName);
    });

    test('should not set id.', () => {
      player.id = 100;
      expect(player.id).toEqual(member.id);
    });

    test('should not set member.', () => {
      player.member = createGuildMemberMock();
      expect(player.member).toMatchObject(member);
      expect(player.id).toBe(member.id);
    });

    test('should set gamemaster.', () => {
      const gamemaster = new Player(createGuildMemberMock(), true);
      const regularPlayer = new Player(createGuildMemberMock());
      gamemaster.isGamemaster = false;
      regularPlayer.isGamemaster = true;
      expect(gamemaster.isGamemaster).toEqual(false);
      expect(regularPlayer.isGamemaster).toEqual(true);
    });

    test('should not set gamemaster if value is not boolean.', () => {
      const gamemaster = new Player(createGuildMemberMock(), true);
      gamemaster.isGamemaster = 22;
      expect(gamemaster.isGamemaster).toEqual(true);
      gamemaster.isGamemaster = '22';
      expect(gamemaster.isGamemaster).toEqual(true);
    });

    test('should not set score.', () => {
      player.score = 22;
      expect(player.score).toEqual(0);
    });
  });

  describe('Public Methods:', () => {
    describe('incrementScore()', () => {
      test('should increment score by 1.', () => {
        expect(player.score).toEqual(0);
        player.incrementScore();
        expect(player.score).toEqual(1);
      });

      test('should return new score.', () => {
        const newScore = player.incrementScore();
        expect(newScore).toBe(1);
      });
    });
  });
});
