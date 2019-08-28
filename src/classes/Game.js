const { GAME_STATUS } = require('../common/constants');
const Player = require('./Player');
const EventEmitter = require('events');
const { prepareScoreboardMessage } = require('../utils/game');
const { GameStatusError, GamePlayersError, PlayerError, GameRequirementsError } = require('./Errors');

class Game extends EventEmitter {
  constructor(initialMember) {
    super();

    const initialPlayer = new Player(initialMember, true);

    this._gamemaster = initialPlayer;
    this._cardCzar = null;
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
    this._guild.game = null;

    for (const player of this._players) {
      player.member.user.game = null;
    }
    this.broadcastToPlayers(`Game has been stopped by gamemaster **${this._gamemaster.name}**`);

    if (this._status === GAME_STATUS.playing) {
      const scoreboard = this.getScoreboard();
      const scoreboardMessage = prepareScoreboardMessage(scoreboard);
      this.broadcastToPlayers(`The score is as follows: ${scoreboardMessage}`);
    }
    this._status = GAME_STATUS.finished;

    return true;
  }

  addPlayer(newMember) {
    /* There's a limit of players so there should be a check before adding
    However, this limit would be dependant on the guild.
    We still need to define how these guild settings are saved. */
    this._validateBeforeAddingPlayer();

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

    if (player.id === this._gamemaster.id) {
      throw new GamePlayersError('Kicking the gamemaster is not possible!');
    }

    const kickedPlayer = this._removePlayerFromGame(player, playerIndex);

    if (kickedPlayer) {
      kickedPlayer.member.user.game = null;
      kickedPlayer.member.send('You have been kicked from the game!');
    }

    return kickedPlayer;
  }

  getScoreboard() {
    if (this._status !== GAME_STATUS.playing) {
      throw new GameStatusError('Game has not been started!');
    }

    const scoreboard = [];
    for (const player of this._players) {
      scoreboard.push({
        name: player.name,
        id: player.id,
        score: player.score
      });
    }
    return scoreboard;
  }

  getPlayersLabel() {
    /* The 10 here corresponds to the max number of players a game
    can have. This value should be settable per guild and will be
    saved in a config file. In the meantime, 10 is the hardcoded value. */
    return `[${this._players.length}/10]`;
  }

  broadcastToPlayers(message, playerNotToMessage = { id: null }) {
    for (const player of this._players) {
      if (player.id === playerNotToMessage.id) {
        continue;
      }
      player.member.send(message);
    }
  }

  _validateBeforeStarting() {
    if (this._players.length < 3) {
      throw new GameRequirementsError('Game can only be started with at least 3 players!');
    }

    if (this._status === GAME_STATUS.playing) {
      throw new GameStatusError('Game is already on-going!');
    }
  }

  _validateBeforeAddingPlayer() {
    if (this._status === GAME_STATUS.playing) {
      throw new GameStatusError('Game is already on-going!');
    }
    if (this.players.length >= 10) {
      throw new GamePlayersError('The game is full!');
    }
  }

  _endAbruptly() {
    /* Implementation is yet to be decided. However it should return a falsey value. */
  }

  _removePlayerFromGame(player, index) {
    if (index < 0) {
      throw new PlayerError('Player is not in-game!');
    }

    const [removedPlayer] = this._players.splice(index, 1);

    if (this._status === GAME_STATUS.playing && this._players.length < 3) {
      return this._endAbruptly();
    }

    this.broadcastToPlayers(`${player.name} has left the game.`);

    if (this._players.length > 1) {
      if (player.isGamemaster) {
        const newGamemaster = this._chooseRandomPlayer();
        newGamemaster.isGamemaster = true;
        this._gamemaster = newGamemaster;
        this.broadcastToPlayers(`**${this._gamemaster.name}** is the new Gamemaster.`);
      }
      /* Additionnally the round should be skipped */
      if (player.isCardCzar) {
        const newCardCzar = this._chooseRandomPlayer();
        newCardCzar.isCardCzar = true;
        this._cardCzar = newCardCzar;
        this.broadcastToPlayers(`**${this._cardCzar.name}** is the new Card Czar.`);
      }
    }
    return removedPlayer;
  }

  _chooseRandomPlayer() {
    const randomIndex = Math.floor(Math.random() * this._players.length);
    return this._players[randomIndex];
  }

  _chooseACardCzar() {
    const cardCzar = this._chooseRandomPlayer;
    cardCzar.isCardCzar(true);
    return cardCzar;
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

  get cardCzar() {
    if (this._status === GAME_STATUS.playing) {
      return this._cardCzar;
    }
    throw new GamePlayersError('Card Czar has not been choosen yet.');
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
