const handleRoll = (e) => {
  e.preventDefault();
  
  sendAjax('POST', $("#rollButton").attr("action"), $("#rollButton").serialize(), function() {
    loadTeam();
  });
  
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
    <input clasName="submitButton" type="submit" value="Roll Character"/>
    <input type="hidden" name="_csrf" value={props.csrf}/>
    </form>
  );
};

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
      <div key={char._id} className="char">
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

const loadTeam = () => {
  sendAjax('GET', '/getTeam', null, (data) => {
    ReactDOM.render(
      <TeamList team={data.team}/>, document.querySelector("#team")
    );
  });
};

const setup = function(csrf) {
  ReactDOM.render(
    <TeamList team={[]} />, document.querySelector("#team")
  );
  ReactDOM.render(
    <RollButton csrf={csrf}/>, document.querySelector("#roll")
  );
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