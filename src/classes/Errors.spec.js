const { GameError, GamePlayersError, GameStatusError, PlayerError, GameRequirementsError } = require('./Errors');

describe('Classes: Errors', () => {
  describe('Classes: PlayerError', () => {
    let error;

    beforeEach(() => {
      error = new PlayerError();
    });

    test('should create a PlayerError instance.', () => {
      expect(error).toBeInstanceOf(PlayerError);
    });

    test('should contain a message.', () => {
      const errorMessage = 'Wrong player in game!';
      const error = new PlayerError(errorMessage);
      expect(error.message).toBe(errorMessage);
      const emptyError = new PlayerError();
      expect(emptyError.message).not.toBe(undefined);
    });

    test('should contain a name equal to PlayerError.', () => {
      expect(error.name).toBe('PlayerError');
    });
  });

  describe('Classes: GameError', () => {
    let error;

    beforeEach(() => {
      error = new GameError();
    });

    test('should create a GameError instance.', () => {
      expect(error).toBeInstanceOf(GameError);
    });

    test('should contain a message.', () => {
      const errorMessage = 'Something happened.';
      const error = new GameError(errorMessage);
      expect(error.message).toBe(errorMessage);
      const emptyError = new GameError();
      expect(emptyError.message).not.toBe(undefined);
    });

    test('should contain a name equal to GameError.', () => {
      expect(error.name).toBe('GameError');
    });
  });

  describe('Classes: GamePlayersError', () => {
    let error;

    beforeEach(() => {
      error = new GamePlayersError();
    });

    test('should create a GamePlayersError instance.', () => {
      expect(error).toBeInstanceOf(GamePlayersError);
    });

    test('should contain a message.', () => {
      const errorMessage = 'Something happened.';
      const error = new GamePlayersError(errorMessage);
      expect(error.message).toBe(errorMessage);
      const emptyError = new GamePlayersError();
      expect(emptyError.message).not.toBe(undefined);
    });

    test('should contain a name equal to GameError.', () => {
      expect(error.name).toBe('GamePlayersError');
    });
  });

  describe('Classes: GameStatusError', () => {
    let error;

    beforeEach(() => {
      error = new GameStatusError();
    });

    test('should create a GameStatusError instance.', () => {
      expect(error).toBeInstanceOf(GameStatusError);
    });

    test('should contain a message.', () => {
      const errorMessage = 'Wrong game status!';
      const error = new GameStatusError(errorMessage);
      expect(error.message).toBe(errorMessage);
      const emptyError = new GameStatusError();
      expect(emptyError.message).not.toBe(undefined);
    });

    test('should contain a name equal to GameStatusError.', () => {
      expect(error.name).toBe('GameStatusError');
    });
  });

  describe('Classes: GameRequirementsError', () => {
    let error;

    beforeEach(() => {
      error = new GameRequirementsError();
    });

    test('should create a GameRequirementsError instance.', () => {
      expect(error).toBeInstanceOf(GameRequirementsError);
    });

    test('should contain a message.', () => {
      const errorMessage = 'Wrong game status!';
      const error = new GameRequirementsError(errorMessage);
      expect(error.message).toBe(errorMessage);
      const emptyError = new GameRequirementsError();
      expect(emptyError.message).not.toBe(undefined);
    });

    test('should contain a name equal to GameRequirementsError.', () => {
      expect(error.name).toBe('GameRequirementsError');
    });
  });
});
