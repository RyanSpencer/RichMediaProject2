const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

let CharacterModel = {};

const convertId = mongoose.Types.ObjectId;


const CharacterSchema = new mongoose.Schema({
  gatcha: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Gatcha',
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdDate: {
    type: Date,
    default: Date.now,
  },

  level: {
    type: Number,
    required: true,
    default: 0,
  },

});

CharacterSchema.statics.toAPI = (doc) => ({
  name: doc.name,
});

CharacterSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return CharacterModel.find(search).select('gatcha level').exec(callback);
};

CharacterModel = mongoose.model('Character', CharacterSchema);

module.exports.CharacterModel = CharacterModel;
module.exports.CharacterSchema = CharacterSchema;
