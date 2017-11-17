const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let GatchaModel = {};

const converId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const GatchaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  starRating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  frequency: {
    type: Number,
    min: 0,
    max: 100,
    required: true,
  },
});

GatchaSchema.statics.randomizeByStar = (star, callback) => {
  const search = {
    starRating: star,
  };
  
  return GatchaModel.find(search).select('name, starRating, frequency').exec(callback);
};

GatchaModel = mongoose.model('Gatcha', GatchaSchema);

module.exports.GatchaModel = GatchaModel;
module.exports.GatchaSchema = GatchaSchema;