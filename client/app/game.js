let interval = {};
let chosenChar = {};
let char = {};

const gameplayLoop = (result) => {
  document.querySelector('#word').textContent = result.word;
  document.querySelector('#time').textContent = result.time;
  document.querySelector('#wordInput').value = "";
  
  if (result.failure) {
    document.querySelector('#submitWord').disabled = true;
    return;
  }
  
   let countDown = result.time;
   interval = setInterval(() => {
    if (countDown == 0) {
      clearInterval(interval);
      sendAjax('POST', '/game', `win=false&_csrf=${result.csrf}`, (result) => {
        document.querySelector('#word').textContent = result.word;
        document.querySelector('#time').textContent = result.time;
        document.querySelector('#submitWord').disabled = true;
      });
    }
    else {
      countDown--;
      document.querySelector('#time').textContent = countDown;
    }
  }, 1000);
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

const Character = (props) => {
  return(
    <div key={props.char._id} className={`char${props.char.star}`}>
        <img className="charPic" src={grabPhoto(props.char.name)} alt="Character Face"/>
        <h3 className="charName"> Name: {props.char.name}</h3>
        <h3 className="charStar"> Star Rating: {props.char.star}</h3>
        <h3 className="charPower">Power: {props.char.power}</h3>
        <h3 className="charLevel">Level: {props.char.level}</h3>
    </div>
  );
};

const handleSelect = (e) => {
  const teamSelect = document.querySelector("#teamSelection");
  let charSelect = "";
  if (teamSelect) charSelect = teamSelect.value
  chosenChar = {};
  for (let i = 0; i < char.length; i++) {
    if (char[i]._id === charSelect) {
      chosenChar = char[i];
    }
  }
  console.dir(chosenChar);
  ReactDOM.render(
    <Character char={chosenChar}/>, document.querySelector('#char')
  );
};
const TeamList = (props) => {
  if (props.team.length === 0) {
    return (
      <div className="teamSelection">
        <h3 className="emptyTeam">You Have No Characters</h3>
      </div>
    );
  }
  
  char = props.team;
  
  const teamNodes = props.team.map(function(char) {
    return(
      <option value={char._id}>{char.name} - Lvl {char.level}</option>
    );
  });
  
  return (
    <div>
      <label htmlFor="teamSelection">Select character to use: </label>
      <select id="teamSelection">
        {teamNodes}
      </select>
    </div>
    
  );
};

const loadTeam = () => {
  sendAjax('GET', '/getTeam', null, (data) => {
    ReactDOM.render(
      <TeamList team={data.team}/>, document.querySelector("#team")
    );
    document.querySelector('#teamSelection').addEventListener('change', handleSelect);
  });
};

const handleTyping = (e) => {
  e.preventDefault();
  
  clearInterval(interval);
  
  const dataToSend =  $("#game").serialize() + '&word=' 
  + document.querySelector('#word').textContent + "&star"
  + chosenChar.star;
  
  sendAjax('POST', $("#game").attr("action"), dataToSend, gameplayLoop);
  
  return false;
};

const GameplayWindow = (props) => {
  return(
    <form id="game"
      onSubmit={handleTyping}
      action="/game"
      method="POST"
      className="mainForm">
      <h2>Type the words as they appear before the time runs outs</h2>
      <h3>Time remaining: <span id="time">0</span></h3>
      <h3>Word: <span id="word"></span></h3>
      <input type="text" name="text" id="wordInput"/>
      <input type="submit" id="submitWord" value="Finished Word"/>
      <input type="hidden" name="_csrf" value={props.csrf}/>
    </form>
  );
};

const setup = (csrf) => {
  ReactDOM.render(
    <GameplayWindow csrf={csrf}/>, document.querySelector('#gameText')
  );
  sendAjax('POST', '/game', `first=true&_csrf=${csrf}`, gameplayLoop);
  
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