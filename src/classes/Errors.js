class PlayerError extends Error {
  constructor(message, ...args) {
    super(message, args);

    this.name = 'PlayerError';
    this.message = message || 'No error message was specified.';

    Error.captureStackTrace(this, PlayerError);
  }
}

class GameError extends Error {
  constructor(message, ...args) {
    super(message, args);

    this.name = 'GameError';
    this.message = message || 'No error message was specified.';

    Error.captureStackTrace(this, GameError);
  }
}

class GameStatusError extends GameError {
  constructor(message, ...args) {
    super(message, args);

    this.name = 'GameStatusError';

    Error.captureStackTrace(this, GameStatusError);
  }
}

class GameRequirementsError extends GameError {
  constructor(message, ...args) {
    super(message, args);

    this.name = 'GameRequirementsError';

    Error.captureStackTrace(this, GameRequirementsError);
  }
}

module.exports = {
  PlayerError,
  GameError,
  GameStatusError,
  GameRequirementsError
};
