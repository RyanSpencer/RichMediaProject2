'use strict';

var interval = {};
var chosenChar = {};
var char = {};

var gameplayLoop = function gameplayLoop(result) {
  document.querySelector('#word').textContent = result.word;
  document.querySelector('#time').textContent = result.time;
  document.querySelector('#wordInput').value = "";

  if (result.failure) {
    document.querySelector('#submitWord').disabled = true;
    return;
  }

  var countDown = result.time;
  interval = setInterval(function () {
    if (countDown == 0) {
      clearInterval(interval);
      sendAjax('POST', '/game', 'win=false&_csrf=' + result.csrf, function (result) {
        document.querySelector('#word').textContent = result.word;
        document.querySelector('#time').textContent = result.time;
        document.querySelector('#submitWord').disabled = true;
      });
    } else {
      countDown--;
      document.querySelector('#time').textContent = countDown;
    }
  }, 1000);
};

//Determine which photo to display
var grabPhoto = function grabPhoto(name) {
  switch (name) {
    case "Senjougahara":
      return "/assets/img/crab.jpg";
      break;
    case "Hachikuji":
      return "/assets/img/snail.jpg";
      break;
    case "Kanbaru":
      return "/assets/img/monkey.jpg";
      break;
    case "Nadeko":
      return "/assets/img/snake.jpg";
      break;
    case "Hanekawa":
      return "/assets/img/cat.jpg";
      break;
    case "Karen":
      return "/assets/img/bee.jpg";
      break;
    default:
      return "/assets/img/error.jpg";
      break;
  }
};

var Character = function Character(props) {
  return React.createElement(
    'div',
    { key: props.char._id, className: 'char' + props.char.star },
    React.createElement('img', { className: 'charPic', src: grabPhoto(props.char.name), alt: 'Character Face' }),
    React.createElement(
      'h3',
      { className: 'charName' },
      ' Name: ',
      props.char.name
    ),
    React.createElement(
      'h3',
      { className: 'charStar' },
      ' Star Rating: ',
      props.char.star
    ),
    React.createElement(
      'h3',
      { className: 'charPower' },
      'Power: ',
      props.char.power
    ),
    React.createElement(
      'h3',
      { className: 'charLevel' },
      'Level: ',
      props.char.level
    )
  );
};

var handleSelect = function handleSelect(e) {
  var teamSelect = document.querySelector("#teamSelection");
  var charSelect = "";
  if (teamSelect) charSelect = teamSelect.value;
  chosenChar = {};
  for (var i = 0; i < char.length; i++) {
    if (char[i]._id === charSelect) {
      chosenChar = char[i];
    }
  }
  console.dir(chosenChar);
  ReactDOM.render(React.createElement(Character, { char: chosenChar }), document.querySelector('#char'));
};
var TeamList = function TeamList(props) {
  if (props.team.length === 0) {
    return React.createElement(
      'div',
      { className: 'teamSelection' },
      React.createElement(
        'h3',
        { className: 'emptyTeam' },
        'You Have No Characters'
      )
    );
  }

  char = props.team;

  var teamNodes = props.team.map(function (char) {
    return React.createElement(
      'option',
      { value: char._id },
      char.name,
      ' - Lvl ',
      char.level
    );
  });

  return React.createElement(
    'div',
    null,
    React.createElement(
      'label',
      { htmlFor: 'teamSelection' },
      'Select character to use: '
    ),
    React.createElement(
      'select',
      { id: 'teamSelection' },
      teamNodes
    )
  );
};

var loadTeam = function loadTeam() {
  sendAjax('GET', '/getTeam', null, function (data) {
    ReactDOM.render(React.createElement(TeamList, { team: data.team }), document.querySelector("#team"));
    document.querySelector('#teamSelection').addEventListener('change', handleSelect);
  });
};

var handleTyping = function handleTyping(e) {
  e.preventDefault();

  clearInterval(interval);

  var dataToSend = $("#game").serialize() + '&word=' + document.querySelector('#word').textContent + "&star" + chosenChar.star;

  sendAjax('POST', $("#game").attr("action"), dataToSend, gameplayLoop);

  return false;
};

var GameplayWindow = function GameplayWindow(props) {
  return React.createElement(
    'form',
    { id: 'game',
      onSubmit: handleTyping,
      action: '/game',
      method: 'POST',
      className: 'mainForm' },
    React.createElement(
      'h2',
      null,
      'Type the words as they appear before the time runs outs'
    ),
    React.createElement(
      'h3',
      null,
      'Time remaining: ',
      React.createElement(
        'span',
        { id: 'time' },
        '0'
      )
    ),
    React.createElement(
      'h3',
      null,
      'Word: ',
      React.createElement('span', { id: 'word' })
    ),
    React.createElement('input', { type: 'text', name: 'text', id: 'wordInput' }),
    React.createElement('input', { type: 'submit', id: 'submitWord', value: 'Finished Word' }),
    React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf })
  );
};

var setup = function setup(csrf) {
  ReactDOM.render(React.createElement(GameplayWindow, { csrf: csrf }), document.querySelector('#gameText'));
  sendAjax('POST', '/game', 'first=true&_csrf=' + csrf, gameplayLoop);

  loadCurrency();

  loadTeam();
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
'use strict';

var currentMoney = 0;

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
};

var redirect = function redirect(response) {
  window.location = response.redirect;
};
var loadCurrency = function loadCurrency() {
  sendAjax('GET', '/check', null, function (data) {
    document.querySelector("#lots").textContent = data.currency;
    currentMoney = data.currency;
  });
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
