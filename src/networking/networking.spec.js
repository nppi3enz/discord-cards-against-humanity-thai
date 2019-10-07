require('../common/globals');
const mockAxios = require('axios');
const { getPackListByType } = require('.');
const { EXPANSION_PACK_TYPES } = require('../common/constants');
const { cardTypeResponse, apiErrorResponse } = require('../../__mocks__/apiResponseMock');

describe('Networking:', () => {
  describe('getPackListByType()', () => {
    afterEach(() => {
      mockAxios.get.mockReset();
    });

    test('should get packs for all types.', (done) => {
      mockAxios.get.mockImplementation(() => (
        Promise.resolve(cardTypeResponse)
      ));
      for (const key in EXPANSION_PACK_TYPES) {
        getPackListByType(EXPANSION_PACK_TYPES[key].id, (data, err) => {
          expect(data).toBeInstanceOf(Object);
          expect(data.packs).toBeInstanceOf(Array);
          expect(err).toBe(undefined);
          done();
        });
      }
    });

    test('should return an error object for non-existing types.', (done) => {
      mockAxios.get.mockImplementation(() => (
        Promise.reject(apiErrorResponse)
      ));
      getPackListByType('unknownType', (data, err) => {
        expect(data).toBe(null);
        expect(err).toBeInstanceOf(Object);
        expect(err.status).toBe(404);
        done();
      });
    });
  });
});
