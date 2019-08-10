const { splitForMessageEmbedField, parseArgs, parseChannelMention } = require('.');
const { MAX_EMBED_FIELD_SIZE } = require('../../common/constants');

const voiceChannelMock = {
  id: '123',
  type: 'voice',
  viewable: true,
  joinable: false
};

const textChannelMock = {
  id: '234',
  type: 'text',
  viewable: false
};

const messageMock = {
  guild: {
    channels: [
      textChannelMock,
      voiceChannelMock
    ]
  }
};

describe('Utils: Common', () => {
  describe('splitForMessageEmbedField()', () => {
    test('should return an array.', () => {
      const actualResult = splitForMessageEmbedField();
      expect(actualResult).toBeInstanceOf(Array);
    });

    test('should return a non empty array when given a [String] argument.', () => {
      const actualResult = splitForMessageEmbedField(['Test']);
      expect(actualResult.length).toBeGreaterThan(0);
    });

    test('should return an array of strings.', () => {
      const actualResult = splitForMessageEmbedField();
      actualResult.forEach((item) => {
        expect(typeof item).toBe('string');
      });
    });

    test('should return an array where the elements are less in size than the limit allowed.', () => {
      let stringArray = 'string,'.repeat(3).split(',');
      const longString = 'abc '.repeat(250);
      const repeatedMessages = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'.repeat(300).split('.');
      stringArray.unshift(longString);
      stringArray = stringArray.concat(repeatedMessages);
      const actualResult = splitForMessageEmbedField(stringArray);
      actualResult.forEach((item) => {
        expect(item.length).toBeLessThan(MAX_EMBED_FIELD_SIZE);
      });
    });

    test('should return an array where its joined elements are equivalent to the joined elements of the argument.', () => {
      let stringArray = 'string,'.repeat(3).split(',');
      const longString = 'abc '.repeat(250);
      const messageWithNewlines = 'this is a message with \n newlines to test \n that newlines are also \n added.';
      const repeatedMessages = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'.repeat(300).split('.');
      stringArray.unshift(longString);
      stringArray.push(messageWithNewlines);
      stringArray = stringArray.concat(repeatedMessages);
      const actualResult = splitForMessageEmbedField(stringArray).join('');
      const expectedResult = stringArray.join('');
      expect(actualResult).toBe(expectedResult);
    });
  });

  describe('parseArgs()', () => {
    test('should return an object.', () => {
      const actualResult = parseArgs();
      expect(actualResult).toBeInstanceOf(Object);
    });

    describe('Object properties:', () => {
      test('should return an object with a subCommand property.', () => {
        const actualResult = parseArgs(['sub']);
        expect(actualResult).toMatchObject({
          ...actualResult,
          subCommand: 'sub'
        });
      });

      test('should return a null subCommand property when an empty array is passed.', () => {
        const actualResult = parseArgs([]);
        expect(actualResult).toMatchObject({
          ...actualResult,
          subCommand: null
        });
      });

      test('should return an object with a argsList property.', () => {
        const actualResult = parseArgs(['sub', 'list1', 'list2']);
        expect(actualResult).toMatchObject({
          subCommand: 'sub',
          argsList: ['list1', 'list2']
        });
      });
    });
  });

  describe('parseChannelMention()', () => {
    test('should return an object with at least an "exists" property.', () => {
      const actualResult = parseChannelMention(messageMock);
      expect(actualResult).toBeInstanceOf(Object);
      expect(actualResult).toHaveProperty('exists');
      expect(typeof actualResult.exists).toBe('boolean');
    });

    test('should return a false exists property if channelString has no numbers.', () => {
      const actualResult = parseChannelMention(messageMock, 'aslkjasl', () => {
        expect(actualResult.exists).toBe(false);
      });
    });

    test('should return a false exists property if channel is not found.', () => {
      const fakeChannelId = '62816382';
      const actualResult = parseChannelMention(messageMock, fakeChannelId);
      expect(actualResult.exists).toBe(false);
    });

    test('should return an object with the channel info if found.', () => {
      const voiceChannelId = '123';
      const actualResult = parseChannelMention(messageMock, voiceChannelId);
      expect(actualResult).toBeInstanceOf(Object);
      expect(actualResult).toHaveProperty('exists', true);
      expect(actualResult).toHaveProperty('type', voiceChannelMock.type);
      expect(actualResult).toHaveProperty('viewable', voiceChannelMock.viewable);
      expect(actualResult).toHaveProperty('joinable', voiceChannelMock.joinable);
      expect(actualResult).toHaveProperty('channel', voiceChannelMock);
    });

    test('should return an object with a null joinable property if channel is of type text.', () => {
      const textChannelId = '234';
      const actualResult = parseChannelMention(messageMock, textChannelId);
      expect(actualResult).toBeInstanceOf(Object);
      expect(actualResult).toHaveProperty('exists', true);
      expect(actualResult).toHaveProperty('type', textChannelMock.type);
      expect(actualResult).toHaveProperty('viewable', textChannelMock.viewable);
      expect(actualResult).toHaveProperty('joinable', null);
      expect(actualResult).toHaveProperty('channel', textChannelMock);
    });

    test('should return the proper channel info object if the id is surrounded by other characters.', () => {
      const voiceChannelId = '<@123>'; // The stringified mention looks a bit like this.
      const actualResult = parseChannelMention(messageMock, voiceChannelId);
      expect(actualResult).toBeInstanceOf(Object);
      expect(actualResult).toHaveProperty('exists', true);
      expect(actualResult).toHaveProperty('type', voiceChannelMock.type);
      expect(actualResult).toHaveProperty('viewable', voiceChannelMock.viewable);
      expect(actualResult).toHaveProperty('joinable', voiceChannelMock.joinable);
      expect(actualResult).toHaveProperty('channel', voiceChannelMock);
    });
  });
});
