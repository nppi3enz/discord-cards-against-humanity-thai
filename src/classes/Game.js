const { GAME_STATUS } = require('../common/constants');
const Player = require('./Player');
const EventEmitter = require('events');

class Game extends EventEmitter {
  constructor(initialMember) {
    super();

    const initialPlayer = new Player(initialMember, true);

    this._gamemaster = initialPlayer;
    this._players = [initialPlayer];
    this._status = GAME_STATUS.preparing;
  }

  get gamemaster() {
    return this._gamemaster;
  }

  get players() {
    return this._players;
  }

  get status() {
    return this._status;
  }
}

module.exports = Game;
