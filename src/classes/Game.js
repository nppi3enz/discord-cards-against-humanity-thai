const { GAME_STATUS } = require('../common/constants');
const Player = require('./Player');
const EventEmitter = require('events');
const { GameStatusError, PlayerError, GameRequirementsError } = require('./Errors');

class Game extends EventEmitter {
  constructor(initialMember) {
    super();

    const initialPlayer = new Player(initialMember, true);

    this._gamemaster = initialPlayer;
    this._players = [initialPlayer];
    this._status = GAME_STATUS.preparing;
    this._guild = initialMember.guild;
  }

  start() {
    /* This method is still a wip because the actual game starting
    process is not yet defined. */
    this._validateBeforeStarting();

    this._status = GAME_STATUS.playing;

    return true;
  }

  end() {
    /* This method is still a wip because the actual game ending
    process is not yet defined. */
    this._validateBeforeEnding();

    this._status = GAME_STATUS.finished;

    return true;
  }

  addPlayer(newMember) {
    /* There's a limit of players so there should be a check before adding
    However, this limit would be dependant on the guild.
    We still need to define how these guild settings are saved. */

    const newPlayer = new Player(newMember);

    if (this._isPlayerInList(newPlayer)) {
      throw new PlayerError('Player is already in-game!');
    }

    this._players.push(newPlayer);
    return newPlayer;
  }

  removePlayer(playerId) {
    /* If there's only one player left and this player is removed,
    an event marking the end of the game should be emitted. */

    const { player, playerIndex } = this._findPlayerById(playerId);
    return this._removePlayerFromGame(player, playerIndex);
  }

  kickPlayer(playerName) {
    const { player, playerIndex } = this._findPlayerByName(playerName);
    return this._removePlayerFromGame(player, playerIndex);
  }

  _validateBeforeStarting() {
    if (this._players.length < 3) {
      throw new GameRequirementsError('Game can only be started with at least 3 players!');
    }

    if (this._status === GAME_STATUS.playing) {
      throw new GameStatusError('Game is already on-going!');
    }
  }

  _validateBeforeEnding() {
    if (this.status !== GAME_STATUS.playing) {
      throw new GameStatusError('Game has not been started!');
    }
  }

  _removePlayerFromGame(player, index) {
    if (index < 0) {
      throw new PlayerError('Player is not in-game!');
    }

    const [removedPlayer] = this._players.splice(index, 1);

    if (player.isGamemaster) {
      const newGamemaster = this._chooseRandomPlayer();
      newGamemaster.isGamemaster = true;
      this._gamemaster = newGamemaster;
    }

    return removedPlayer;
  }

  _chooseRandomPlayer() {
    const randomIndex = Math.floor(Math.random() * this._players.length);
    return this._players[randomIndex];
  }

  _findPlayerByName(playerName) {
    let playerIndex = -1;
    const player = this._players.find((player, index) => {
      if (player.name === playerName) {
        playerIndex = index;
        return true;
      }
      return false;
    });

    return {
      playerIndex,
      player
    };
  }

  _findPlayerById(playerId) {
    let playerIndex = -1;
    const player = this._players.find((player, index) => {
      if (player.id === playerId) {
        playerIndex = index;
        return true;
      }
      return false;
    });

    return {
      playerIndex,
      player
    };
  }

  _isPlayerInList(player) {
    return this._players.some(playerInList => playerInList.id === player.id);
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

  get guild() {
    return this._guild;
  }
}

module.exports = Game;
