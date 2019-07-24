const axios = require('axios');
const { EXPANSION_PACK_TYPES } = require('../common/constants');

const CAH_API_URL = 'https://cah.greencoaststudios.com/api/v1/';
const HTTP_STATUS_CODES = {
  NOT_FOUND: 404,
  SERVER_ERROR: 500
};

function getPackListByType(expansionType, callback) {
  axios.get(CAH_API_URL + expansionType)
    .then(({ data }) => {
      callback(data);
    })
    .catch((error) => {
      const { status, data } = error;
      const expansionTypeName = EXPANSION_PACK_TYPES[expansionType];
      const errorInfo = {
        status,
        data
      };

      switch (errorInfo.status) {
      case HTTP_STATUS_CODES.NOT_FOUND:
        errorInfo.message = `The expansion type **${expansionTypeName}** was not found!`;
        break;
      case HTTP_STATUS_CODES.SERVER_ERROR:
        errorInfo.message = `There was a server error when trying to retrieve the **${expansionTypeName}** expansion type!`;
        break;
      default:
        errorInfo.message = `An unknown error happened when trying to retrieve the **${expansionTypeName}** expansion type!`;
        break;
      }

      logger.error(error);
      callback(null, errorInfo);
    });
}

module.exports = {
  getPackListByType
};
