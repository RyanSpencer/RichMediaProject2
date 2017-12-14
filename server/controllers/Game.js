const randomWords = require('random-words');

const gamePage = (req, res) => {
  res.render('game', { csrfToken: req.csrfToken() });
};

const game = (req, res) => {
  const responseJSON = {
    time: 30,
  };
  
  responseJSON.csrf = req.body._csrf;
  if (req.first) {
    responseJSON.word = randomWords();

    return res.json(responseJSON);
  }

  if (req.body.win) {
    responseJSON.word = 'Sorry try again next time: Out of Time';

    return res.json(responseJSON);
  }
  
  console.log(req.body);
  
  if (req.body.word !== req.body.text) {
    responseJSON.word = 'Sorry try again next time: Word is wrong';
    responseJSON.failure = true;

    return res.json(responseJSON);
  }

  responseJSON.word = randomWords();
  return res.json(responseJSON);
};

module.exports.gamePage = gamePage;
module.exports.game = game;
