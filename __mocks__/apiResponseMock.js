const cardTypeResponse = {
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

const apiErrorResponse = {
  response: {
    data: {

    },
    status: 404
  }
};

module.exports = {
  cardTypeResponse,
  apiErrorResponse
};
