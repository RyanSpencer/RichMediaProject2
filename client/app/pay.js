const handlePay = (e) => {
  e.preventDefault();
  var formData = $(`#${e.currentTarget.id}`);
  var originalVal = formData[0][2]["value"];
  
  formData[0][2]["value"] = Number(formData[0][2]["value"]) + Number(document.querySelector("#lots").textContent);
  
  sendAjax('POST', $(`#${e.currentTarget.id}`).attr("action"), formData.serialize(), function(data) {
    currentMoney = data.currency;
    document.querySelector("#lots").textContent = data.currency;
    formData[0][2]["value"] = originalVal;
  });
};

const PayBox = (props) => {
  return (
    <form id={`pay${props.amount}`}
      onSubmit={handlePay}
      name="payBox"
      action="/pay"
      method="POST"
      className="payBox">
      <input className="submitButton" type="submit" value={`Purchase ${props.amount} currency (${props.cost} USD)`}/>
      <input type="hidden" name="_csrf" value={props.csrf}/>
      <input type="hidden" name="currency" value={props.amount}/>
    </form>
  );
};

const setup = function(csrf) {
  ReactDOM.render(
    <div>
      <PayBox csrf={csrf} amount={2} cost={1.00}/>
      <PayBox csrf={csrf} amount={4} cost={2.00}/>
      <PayBox csrf={csrf} amount={8} cost={4.00}/>
      <PayBox csrf={csrf} amount={16} cost={8.00}/>
      <PayBox csrf={csrf} amount={2000} cost={1000.00}/>
    </div>,
    document.querySelector("#pays")
  );
  loadCurrency();
};



const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
    setup(result.csrfToken);
  });
};

$(document).ready(function() {
  getToken();
});