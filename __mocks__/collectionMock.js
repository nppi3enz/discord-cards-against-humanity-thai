const { failingCommandMock } = require('./commandMock');

class CollectionMock {
  constructor(command) {
    this.content = {
      [command.name]: command,
      failing: failingCommandMock
    };
  }

  has(contentProp) {
    return this.content.hasOwnProperty(contentProp);
  }

  get(contentProp) {
    if (!this.content.hasOwnProperty(contentProp)) {
      return null;
    }
    return this.content[contentProp];
  }
}

module.exports = CollectionMock;
