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
    const stringArray = 'string,'.repeat(3).split(',');
    const longString = 'abc '.repeat(250);
    stringArray.unshift(longString);
    const actualResult = splitForMessageEmbedField(stringArray);
    actualResult.forEach((item) => {
      expect(item.length).toBeLessThan(MAX_EMBED_FIELD_SIZE);
    });
  });

  test('should return an array where its joined elements are equivalent to the joined elements of the argument.', () => {
    const stringArray = 'string,'.repeat(3).split(',');
    const longString = 'abc '.repeat(250);
    const messageWithNewlines = 'this is a message with \n newlines to test \n that newlines are also \n added.';
    stringArray.unshift(longString);
    stringArray.push(messageWithNewlines);
    const actualResult = splitForMessageEmbedField(stringArray).join('');
    const expectedResult = stringArray.join('');
    expect(actualResult).toBe(expectedResult);
  });
});
