const { GameError, GameStatusError, PlayerError, GameRequirementsError } = require('./Errors');

describe('Classes: Errors', () => {
  describe('Classes: PlayerError', () => {
    test('should create a PlayerError instance.', () => {
      const error = new PlayerError();
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
      const error = new PlayerError();
      expect(error.name).toBe('PlayerError');
    });
  });

  describe('Classes: GameError', () => {
    test('should create a GameError instance.', () => {
      const error = new GameError();
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
      const error = new GameError();
      expect(error.name).toBe('GameError');
    });
  });

  describe('Classes: GameStatusError', () => {
    test('should create a GameStatusError instance.', () => {
      const error = new GameStatusError();
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
      const error = new GameStatusError();
      expect(error.name).toBe('GameStatusError');
    });
  });

  describe('Classes: GameRequirementsError', () => {
    test('should create a GameRequirementsError instance.', () => {
      const error = new GameRequirementsError();
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
      const error = new GameRequirementsError();
      expect(error.name).toBe('GameRequirementsError');
    });
  });
});
