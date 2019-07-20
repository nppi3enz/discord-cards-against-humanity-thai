const { splitForMessageEmbedField } = require('./index');
const { MAX_EMBED_FIELD_SIZE } = require('../../common/constants');

describe('Utils: Common Methods', () => {
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
