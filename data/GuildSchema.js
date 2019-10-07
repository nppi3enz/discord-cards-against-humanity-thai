const mongoose = require('mongoose');

const guildSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    required: true
  },
  voice_module: {
    type: Boolean,
    default: true,
    required: true
  },
  default_lang: {
    type: String,
    default: 'en',
    required: true
  },
  max_players: {
    type: Number,
    default: 10,
    required: true
  },
  tunables: {
    max_score: {
      type: Number,
      default: 8,
      required: true
    },
    timer: {
      type: Number,
      default: 60,
      required: true
    },
    blank_cards: {
      type: Number,
      default: 0,
      required: true
    }
  }
});

module.exports = guildSchema;
