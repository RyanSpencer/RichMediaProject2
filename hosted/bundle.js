"use strict";

var handleRoll = function handleRoll(e) {
  e.preventDefault();

  sendAjax('POST', $("#rollButton").attr("action"), $("#rollButton").serialize(), function () {
    loadTeam();
  });

  return false;
};

var RollButton = function RollButton(props) {
  return React.createElement(
    "form",
    { id: "rollButton",
      onSubmit: handleRoll,
      name: "rollButton",
      action: "/main",
      method: "POST",
      className: "rollButton" },
    React.createElement("input", { clasName: "submitButton", type: "submit", value: "Roll Character" }),
    React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf })
  );
};

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

var TeamList = function TeamList(props) {
  if (props.team.length === 0) {
    return React.createElement(
      "div",
      { className: "teamList" },
      React.createElement(
        "h3",
        { className: "emptyTeam" },
        "You Have No Characters"
      )
    );
  }

  var teamNodes = props.team.map(function (char) {
    return React.createElement(
      "div",
      { key: char._id, className: "char" },
      React.createElement("img", { className: "charPic", src: grabPhoto(char.name), alt: "Character Face" }),
      React.createElement(
        "h3",
        { className: "charName" },
        " Name: ",
        char.name
      ),
      React.createElement(
        "h3",
        { className: "charStar" },
        " Star Rating: ",
        char.star
      ),
      React.createElement(
        "h3",
        { className: "charPower" },
        "Power: ",
        char.power
      ),
      React.createElement(
        "h3",
        { className: "charLevel" },
        "Level: ",
        char.level
      )
    );
  });

  return React.createElement(
    "div",
    { className: "teamList" },
    teamNodes
  );
};

var loadTeam = function loadTeam() {
  sendAjax('GET', '/getTeam', null, function (data) {
    ReactDOM.render(React.createElement(TeamList, { team: data.team }), document.querySelector("#team"));
  });
};

var setup = function setup(csrf) {
  ReactDOM.render(React.createElement(TeamList, { team: [] }), document.querySelector("#team"));
  ReactDOM.render(React.createElement(RollButton, { csrf: csrf }), document.querySelector("#roll"));
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
"use strict";

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
};

var redirect = function redirect(response) {
  window.location = response.redirect;
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
