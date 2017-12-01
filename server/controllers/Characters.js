const models = require('../models');

const Gatcha = models.Gatcha;
const Characters = models.Characters;
const Account = models.Account;
let teams = [];

const mainPage = (req, res) => {
  // Grab the players characters when they open the main page
  Characters.CharacterModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), team: docs });
  });
};

const passwordPage = (req, res) => {
  res.render('password', { csrfToken: req.csrfToken() });
};

const password = (request, response) => {
  const req = request;
  const res = response;

  const user = `${req.session.account.username}`;
  const oldPass = `${req.body.oldPass}`;
  const pass = `${req.body.pass}`;

  // Check for all fields existing again and if both passwords match

  if (!req.body.oldPass || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  // Authenticat that the user exists
  return Account.AccountModel.authenticate(user, oldPass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    // Generate a new hash for the new password
    return Account.AccountModel.generateHash(pass, (salt, hash) => {
      const obj = { username: user };
      const newPass = { password: hash, salt };
      // Now go in an update the one user
      return Account.AccountModel.findOneAndUpdate(obj, { $set: newPass }, (error) => {
        if (error) {
          return res.status(401).json({ error: 'Could not update username' });
        }
        return res.json({ redirect: '/main' });
      });
    });
  });
};

const getTeam = (request, response) => {
  const req = request;
  const res = response;
  teams = [];

  // Find all the user's characters
  Characters.CharacterModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    // Grab all of the ids of the gatcha the player owns
    const gatchaIds = docs.map((team) => team.gatcha);

    // use find with the $in tag to find all gatcha with those ids
    return Gatcha.GatchaModel.find({ _id: { $in: gatchaIds } }, (error, teamArray) => {
      if (teamArray != null) {
        // Loop through and add the information from the gatcha along with the level
        for (let i = 0; i < teamArray.length; i++) {
          teams.push({ name: teamArray[i].name, star: teamArray[i].starRating,
            power: teamArray[i].power, level: docs[i].level });
        }

        console.log(teams);

        return res.json({ team: teams });
      }
      return res.status(404).json({ error: 'No Characters Owned' });
    });
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
module.exports.passwordPage = passwordPage;
module.exports.password = password;
