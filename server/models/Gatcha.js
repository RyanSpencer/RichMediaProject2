const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

let GatchaModel = {};

const GatchaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  starRating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  power: {
    type: String,
    required: true,
  },
});
GatchaSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  star: doc.starRating,
  power: doc.power,
  _id: doc._id,
});

GatchaSchema.statics.randomizeByStar = (callback) => {
  // Randomly determine which kind of character to roll
  // 5 stars are less likely than 4 star which are less likely than 3
  const search = {};
  const roll = Math.random();
  if (roll <= 0.59) {
    search.starRating = 3;
  } else if (roll <= 0.89) {
    search.starRating = 4;
  } else {
    search.starRating = 5;
  }

  GatchaModel.count(search).exec((err, count) => {
    // Randomize among the gatcha of that star and then choose one to return
    const rand = Math.floor(Math.random() * count);

    console.log(rand);

    return GatchaModel.findOne(search).skip(rand).exec(callback);
  });
};

GatchaModel = mongoose.model('Gatcha', GatchaSchema);

module.exports.GatchaModel = GatchaModel;
module.exports.GatchaSchema = GatchaSchema;
