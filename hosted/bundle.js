"use strict";

var handleRoll = function handleRoll(e) {
  e.preventDefault();

  //only let the player roll if they have at least 2 currency
  if (currentMoney < 2) {
    handleError("Not Enough Money to Pull");
    return false;
  }

  //Send post of the roll
  sendAjax('POST', $("#rollButton").attr("action"), $("#rollButton").serialize(), function () {
    //Once it's done reload the team
    loadTeam();
    //Then send the information to the server that they have less money and update on client side
    sendAjax('POST', "/check", "currency=" + (currentMoney - 2) + "&_csrf=" + document.getElementsByName("_csrf")[0].value, function (data) {
      currentMoney = data.currency;
      document.querySelector("#lots").textContent = data.currency;
    });
  });

  return false;
};

var handlePasswordChange = function handlePasswordChange(e) {
  e.preventDefault();

  //Make sure all fields are filled in
  if ($("#oldPass").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
    handleError("Please fill out all fields");
    return false;
  }

  //Make sure new passwords match
  if ($("#pass").val() !== $("#pass2").val()) {
    handleError("Passwords do not match");
    return false;
  }

  //Send the password updates
  sendAjax('POST', $("#passwordForm").attr("action"), $("#passwordForm").serialize(), redirect);

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
    React.createElement("input", { className: "submitButton", type: "submit", value: "Roll Character (2 Currency)" }),
    React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf })
  );
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
      { key: char._id, className: "char" + char.star },
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

var PasswordWindow = function PasswordWindow(props) {
  return React.createElement(
    "form",
    { id: "passwordForm",
      name: "passwordForm",
      onSubmit: handlePasswordChange,
      action: "/password",
      method: "POST",
      className: "mainForm" },
    React.createElement(
      "label",
      { htmlFor: "oldPass" },
      "Old Password: "
    ),
    React.createElement("input", { id: "oldPass", type: "password", name: "oldPass", placeholder: "password" }),
    React.createElement(
      "label",
      { htmlFor: "pass" },
      "New Password: "
    ),
    React.createElement("input", { id: "pass", type: "password", name: "pass", placeholder: "password" }),
    React.createElement(
      "label",
      { htmlFor: "pass2" },
      "New Password: "
    ),
    React.createElement("input", { id: "pass2", type: "password", name: "pass2", placeholder: "retype password" }),
    React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
    React.createElement("input", { className: "formSubmit", type: "submit", value: "Change Password" })
  );
};

var createPasswordWindow = function createPasswordWindow(csrf) {
  ReactDOM.render(React.createElement(PasswordWindow, { csrf: csrf }), document.querySelector("#team"));
};

var loadTeam = function loadTeam() {
  sendAjax('GET', '/getTeam', null, function (data) {
    ReactDOM.render(React.createElement(TeamList, { team: data.team }), document.querySelector("#team"));
  });
};

var setup = function setup(csrf) {
  var passwordButton = document.querySelector("#passwordButton");

  passwordButton.addEventListener('click', function (e) {
    e.preventDefault();
    createPasswordWindow(csrf);
    return false;
  });

  ReactDOM.render(React.createElement(TeamList, { team: [] }), document.querySelector("#team"));
  ReactDOM.render(React.createElement(RollButton, { csrf: csrf }), document.querySelector("#roll"));

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
