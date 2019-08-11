const GuildExtension = (Guild) => (
  class GameGuild extends Guild {
    constructor(client, data) {
      super(client, data);
      this.game = null;
    }
  }
);

module.exports = GuildExtension;
