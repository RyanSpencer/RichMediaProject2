const handleRoll = (e) => {
  e.preventDefault();
  
  //only let the player roll if they have at least 2 currency
  if (currentMoney < 2) {
    handleError("Not Enough Money to Pull");
    return false;
  } 
  
  //Send post of the roll
  sendAjax('POST', $("#rollButton").attr("action"), $("#rollButton").serialize(), function() {
    //Once it's done reload the team
    loadTeam();
    //Then send the information to the server that they have less money and update on client side
    sendAjax('POST', "/check", "currency=" + (currentMoney - 2) + "&_csrf=" + document.getElementsByName("_csrf")[0].value, function(data) {
      currentMoney = data.currency;
      document.querySelector("#lots").textContent = data.currency;
    });
  });
  
  return false;
};

const handlePasswordChange = (e) => {
  e.preventDefault();
  
  //Make sure all fields are filled in
  if ($("#oldPass").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
    handleError("Please fill out all fields");
    return false
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

const RollButton = (props) => {
  return (
    <form id="rollButton"
      onSubmit={handleRoll}
      name="rollButton"
      action="/main"
      method="POST"
      className="rollButton">
    <input className="submitButton" type="submit" value="Roll Character (2 Currency)"/>
    <input type="hidden" name="_csrf" value={props.csrf}/>
    </form>
  );
};

//Determine which photo to display
const grabPhoto = (name) => {
  switch (name) {
    case "Senjougahara": 
      return "/assets/img/crab.jpg";
      break;
    case "Hachikuji":
      return "/assets/img/snail.jpg"
      break;
    case "Kanbaru":
      return "/assets/img/monkey.jpg"
      break;
    case "Nadeko":
      return "/assets/img/snake.jpg"
      break;
    case "Hanekawa":
      return "/assets/img/cat.jpg"
      break;
    case "Karen":
      return "/assets/img/bee.jpg"
      break;
    default:
      return "/assets/img/error.jpg"
      break;
  }
};

const TeamList = function(props) {
  if (props.team.length === 0) {
    return (
      <div className="teamList">
        <h3 className="emptyTeam">You Have No Characters</h3>
      </div>
    );
  }
  
  const teamNodes = props.team.map(function(char) {
    return(
      <div key={char._id} className={`char${char.star}`}>
        <img className="charPic" src={grabPhoto(char.name)} alt="Character Face"/>
        <h3 className="charName"> Name: {char.name}</h3>
        <h3 className="charStar"> Star Rating: {char.star}</h3>
        <h3 className="charPower">Power: {char.power}</h3>
        <h3 className="charLevel">Level: {char.level}</h3>
      </div>
    );
  });
  
  return (
    <div className="teamList">
      {teamNodes}
    </div>
  );
};

const PasswordWindow = (props) => {
  return(
     <form id="passwordForm"
      name="passwordForm"
      onSubmit={handlePasswordChange}
      action="/password"
      method="POST"
      className="mainForm">
      <label htmlFor="oldPass">Old Password: </label>
      <input id="oldPass" type="password" name="oldPass" placeholder="password"/>
      <label htmlFor="pass">New Password: </label>
      <input id="pass" type="password" name="pass" placeholder="password"/>
      <label htmlFor="pass2">New Password: </label>
      <input id="pass2" type="password" name="pass2" placeholder="retype password"/>
      <input type="hidden" name="_csrf" value={props.csrf}/>
      <input className="formSubmit" type="submit" value="Change Password"/>
    </form>
  );
};


const createPasswordWindow = (csrf) => {
  ReactDOM.render(
    <PasswordWindow csrf={csrf}/>,
    document.querySelector("#team")
  );
};

const loadTeam = () => {
  sendAjax('GET', '/getTeam', null, (data) => {
    ReactDOM.render(
      <TeamList team={data.team}/>, document.querySelector("#team")
    );
  });
};

const setup = function(csrf) {
  const passwordButton = document.querySelector("#passwordButton");
  
  passwordButton.addEventListener('click', (e) => {
    e.preventDefault();
    createPasswordWindow(csrf);
    return false;
  });
  
  ReactDOM.render(
    <TeamList team={[]} />, document.querySelector("#team")
  );
  ReactDOM.render(
    <RollButton csrf={csrf}/>, document.querySelector("#roll")
  )
  
  loadCurrency();
  
  loadTeam();
};

const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
    setup(result.csrfToken);
  });
};

$(document).ready(function() {
  getToken();
});