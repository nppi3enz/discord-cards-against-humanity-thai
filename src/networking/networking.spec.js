const { getPackListByType } = require('.');
const { EXPANSION_PACK_TYPES } = require('../common/constants');
const mockAxios = require('axios');
require('../common/globals');

const exampleTypeResponse = {
  data: {
    packs: [
      {
        quantity: {
          black: 7,
          white: 23,
          total: 30
        },
        name: '2012 Holiday Pack',
        id: '2012_holiday_pack'
      },
      {
        name: 'Main Deck',
        id: 'main_deck',
        quantity: {
          total: 1537,
          black: 282,
          white: 1255
        }
      }
    ]
  }
};

const exampleErrorResponse = {
  response: {
    data: {

    },
    status: 404
  }
};

describe('Networking:', () => {
  describe('getPackListByType()', () => {
    afterEach(() => {
      mockAxios.get.mockReset();
    });

    test('should get packs for all types.', (done) => {
      mockAxios.get.mockImplementation(() => (
        Promise.resolve(exampleTypeResponse)
      ));
      for (const type in EXPANSION_PACK_TYPES) {
        getPackListByType(EXPANSION_PACK_TYPES[type].id, (data, err) => {
          expect(data).toBeInstanceOf(Object);
          expect(data.packs).toBeInstanceOf(Array);
          expect(err).toBe(undefined);
          done();
        });
      }
    });

    test('should return an error object for non-existing types.', (done) => {
      mockAxios.get.mockImplementation(() => (
        Promise.reject(exampleErrorResponse)
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
