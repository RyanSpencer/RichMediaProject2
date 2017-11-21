const models = require('../models');

const Gatcha = models.Gatcha;
const Characters = models.Characters;

const mainPage = (req, res) => {
  Characters.CharacterModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), team: docs });
  });
};

const getTeam = (request, response) => {
  const req = request;
  const res = response;

  return Characters.CharacterModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.json({ team: docs });
  });
};


const rollCharacter = (req, res) => {
  let roll = {};

  Gatcha.GatchaModel.randomizeByStar((err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    roll = docs;

    return res.status(200);
  });

  const characterData = {
    gatcha: roll._id,
    owner: req.session.account._id,
  };

  const newChar = new Characters.CharacterModel(characterData);

  const charPromise = newChar.save();

  charPromise.then(() => res.json({ redirect: '/main' }));

  charPromise.catch((err) => {
    console.log(err);

    return res.status(400).json({ error: 'An error occured' });
  });

  return charPromise;
};

module.exports.mainPage = mainPage;
module.exports.getTeam = getTeam;
module.exports.roll = rollCharacter;
