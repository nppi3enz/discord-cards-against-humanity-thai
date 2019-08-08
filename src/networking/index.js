const axios = require('axios');
const { EXPANSION_PACK_TYPES } = require('../common/constants');

const CAH_API_URL = 'https://cah.greencoaststudios.com/api/v1/';

function getPackListByType(expansionType, callback) {
  axios.get(CAH_API_URL + expansionType)
    .then(({ data }) => {
      callback(data);
    })
    .catch((error) => {
      const { response: { status, data } } = error;
      const expansion = EXPANSION_PACK_TYPES[expansionType];
      const errorInfo = {
        ...data,
        status,
        expansion
      };

      if (!data.status) {
        errorInfo.message = `An unknown error happened when trying to retrieve the **${expansionType}** expansion type!`; // Not handled by API.
      }

      logger.error(error);
      callback(null, errorInfo);
    });
}

module.exports = {
  getPackListByType
};
