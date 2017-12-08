"use strict";

var handlePay = function handlePay(e) {
  e.preventDefault();
  var formData = $("#" + e.currentTarget.id);
  var originalVal = formData[0][2]["value"];

  formData[0][2]["value"] = Number(formData[0][2]["value"]) + Number(document.querySelector("#lots").textContent);

  sendAjax('POST', $("#" + e.currentTarget.id).attr("action"), formData.serialize(), function (data) {
    currentMoney = data.currency;
    document.querySelector("#lots").textContent = data.currency;
    formData[0][2]["value"] = originalVal;
  });
};

var PayBox = function PayBox(props) {
  return React.createElement(
    "form",
    { id: "pay" + props.amount,
      onSubmit: handlePay,
      name: "payBox",
      action: "/pay",
      method: "POST",
      className: "payBox" },
    React.createElement("input", { className: "submitButton", type: "submit", value: "Purchase " + props.amount + " currency (" + props.cost + " USD)" }),
    React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
    React.createElement("input", { type: "hidden", name: "currency", value: props.amount })
  );
};

var setup = function setup(csrf) {
  ReactDOM.render(React.createElement(
    "div",
    null,
    React.createElement(PayBox, { csrf: csrf, amount: 2, cost: 1.00 }),
    React.createElement(PayBox, { csrf: csrf, amount: 4, cost: 2.00 }),
    React.createElement(PayBox, { csrf: csrf, amount: 8, cost: 4.00 }),
    React.createElement(PayBox, { csrf: csrf, amount: 16, cost: 8.00 }),
    React.createElement(PayBox, { csrf: csrf, amount: 2000, cost: 1000.00 })
  ), document.querySelector("#pays"));
  loadCurrency();
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
