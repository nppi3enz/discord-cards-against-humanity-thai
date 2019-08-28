class Player {
  constructor(guildMember, isGamemaster = false) {
    this._name = guildMember.displayName;
    this._id = guildMember.id;
    this._member = guildMember;
    this._isGamemaster = isGamemaster;
    this._isCardCzar = false;
    this._score = 0;
  }

  incrementScore() {
    const newScore = this._score++;
    this._score = newScore;
    return newScore;
  }

  set isGamemaster(newValue) {
    if (typeof newValue === 'boolean') {
      this._isGamemaster = newValue;
    }
  }

  set isCardCzar(newValue) {
    if (typeof newValue === 'boolean') {
      this._isCardCzar = newValue;
    }
  }

  get name() {
    return this._name;
  }

  get id() {
    return this._id;
  }

  get member() {
    return this._member;
  }

  get isGamemaster() {
    return this._isGamemaster;
  }

  get isCardCzar() {
    return this._isCardCzar;
  }

  get score() {
    return this._score;
  }
}

module.exports = Player;
