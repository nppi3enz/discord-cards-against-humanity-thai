class Player {
  constructor(guildMember, isGamemaster = false) {
    this._name = guildMember.displayName;
    this._id = guildMember.id;
    this._member = guildMember;
    this._isGamemaster = isGamemaster;
    this._score = 0;
  }

  incrementScore() {
    this._score++;
    return this._score;
  }

  set isGamemaster(newValue) {
    if (typeof newValue === 'boolean') {
      this._isGamemaster = newValue;
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

  get score() {
    return this._score;
  }
}

module.exports = Player;
