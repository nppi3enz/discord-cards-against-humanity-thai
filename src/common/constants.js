const COMMAND_TYPES = ['common', 'guild', 'dm'];

const MAX_EMBED_FIELD_SIZE = 1024;
const MESSAGE_EMBED_COLOR = 'YELLOW';
const MESSAGE_EMBED_HELP_THUMBNAIL = 'https://i.imgur.com/Tqnk48j.png';

const EXPANSION_PACK_TYPES = {
  official: {
    id: 'official',
    name: 'Official'
  },
  third_party: {
    id: 'third_party',
    name: 'Third-Party'
  }
};

const GAME_STATUS = {
  preparing: 'PREPARING',
  playing: 'PLAYING',
  finished: 'FINISHED',
  any: 'ANY'
};

const POSITION_EMOJIS = [
  ':fire:',
  ':star2:',
  ':ok_hand:',
  ':poop:'
];

module.exports = {
  COMMAND_TYPES,
  MAX_EMBED_FIELD_SIZE,
  MESSAGE_EMBED_COLOR,
  MESSAGE_EMBED_HELP_THUMBNAIL,
  EXPANSION_PACK_TYPES,
  GAME_STATUS,
  POSITION_EMOJIS
};
