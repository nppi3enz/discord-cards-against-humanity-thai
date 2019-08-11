const UserExtension = (User) => (
  class GameUser extends User {
    constructor(client, data) {
      super(client, data);
      this.game = null;
    }
  }
);

module.exports = UserExtension;
