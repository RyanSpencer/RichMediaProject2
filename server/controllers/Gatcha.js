const models = require('../models');

const Gatcha = models.Gatcha;

const makerPage = (req, res) => res.render('app', { csrfToken: req.csrfToken() });

const getGatcha = (response) => {
  const res = response;

  return res.json({ gatchas: Gatcha.GatchaModel });
};

const makeGatcha = (char, res) => {
  const gatchaData = {
    name: char.name,
    starRating: char.star,
    power: char.power,
  };

  Gatcha.GatchaModel.find({ name: char.name }, (err, docs) => {
    if (docs.length) {
      console.log(`Character already exists${char.name}`);
    } else {
      const newGatcha = new Gatcha.GatchaModel(gatchaData);

      const gatchaPromise = newGatcha.save();

      gatchaPromise.catch((err) => {
        console.log(err);
        return res.status(400).json({ error: 'An error occured' });
      });

      return gatchaPromise;
    }
  });
};

const makeGatchas = (res) => {
  makeGatcha({ name: 'Senjougahara', star: 5, power: 'Tests' }, res);
  makeGatcha({ name: 'Hachikuji', star: 3, power: 'Snail' }, res);
  makeGatcha({ name: 'Kanbaru', star: 4, power: 'basketball' }, res);
  makeGatcha({ name: 'Nadeko', star: 3, power: 'snake' }, res);
  makeGatcha({ name: 'Hanekawa', star: 5, power: 'cat' }, res);
  makeGatcha({ name: 'Karen', star: 4, power: 'bee' }, res);
};

module.exports.makerPage = makerPage;
module.exports.getGatcha = getGatcha;
module.exports.make = makeGatchas;
