const models = require('../models');

const Gatcha = models.Gatcha;
const Characters = models.Characters;
let teams = [];

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
  teams = [];

  return Characters.CharacterModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    const gatchaIds = docs.map((team) => team.gatcha);


    Gatcha.GatchaModel.find({ _id: { $in: { gatchaIds } } }, (error, teamArray) => {
      for (let i = 0; i < docs.length; i++) {
        teams.push({ name: teamArray[i].name, star: teamArray[i].starRating, power: teamArray[i].power, level: team.level });
      }
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
