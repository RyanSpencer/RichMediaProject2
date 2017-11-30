const models = require('../models');

const Gatcha = models.Gatcha;
const Characters = models.Characters;
const teams = [];

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
    docs.map((team) => {
      Gatcha.GatchaModel.findById(team.gatcha, (error, doc) => {
        teams.push({ name: doc.name, star: doc.starRating, power: doc.power, level: team.level });
      });
    });

    console.log(teams);


    return res.json({ team: teams });
  });
};


const rollCharacter = (req, res) => {
  Gatcha.GatchaModel.randomizeByStar((err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    const characterData = {
      gatcha: docs._id,
      owner: req.session.account._id,
    };

    const newChar = new Characters.CharacterModel(characterData);

    const charPromise = newChar.save();

    charPromise.then(() => res.json({ redirect: '/main' }));

    charPromise.catch((error) => {
      console.log(error);

      return res.status(400).json({ error: 'An error occured' });
    });

    return charPromise;
  });
};

module.exports.mainPage = mainPage;
module.exports.getTeam = getTeam;
module.exports.roll = rollCharacter;
