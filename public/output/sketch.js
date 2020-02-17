// Open and connect output socket
let socket = io('/output');
let displayTextString = '';
let users = {};

// Listen for confirmation of connection
socket.on('connect', function() {
	console.log('Connected');
 
  socket.on('userList', (message) => {
    users = message
    if (gameState == 'WAITING') {
      displayTextString = `${Object.keys(users).length} connected`
    }
  })

});

let canClick = false;
let ranNum;
let result = '';
let count = 0;

let sec = 5;
// WAITING, INGAME, FINISHED
let gameState = 'WAITING';
let loseArr = [];
let startButton;

function setup() {
	displayText = createP('');
	displayText.class('content');
  startButton = createButton('start game');
	startButton.mousePressed(buttonPressed);

	socket.on('inputValue', (message) => {
		let id = message.id;
		let data = message.data;

    users[id] = {
      value : data
    };

		count = 0;
		for (id in users) {
			if (users[id].value == 1) {
				count += 1;
			}
		}

		count == ranNum ? (result = `Wow`) : (result = `Uh Oh`);
	});
}

function draw() {
  displayText.html(displayTextString);
  if (gameState === 'INGAME') {
    startButton.attribute('disabled', true)
  } else {
    startButton.removeAttribute('disabled')
  }
}

function buttonPressed() {
  if (gameState === 'INGAME') {
    // do nothing
    console.log('game already started')
    return;
  } else if (gameState === 'WAITING') {

    gameState = 'INGAME';
    randomNum();
    let timer = setInterval(() => {
      sec--;
      canClick = true;
      if (sec < 0) {
        clearInterval(timer);
        canClick = false;
        sec = 5;
        gameState = 'FINISHED'
        replaceText()
        startButton.html('continue')
      }
      socket.emit('click', canClick);
      console.log(sec);
    }, 1000);
  } else { // FINISHED
    startButton.html('start game')
    gameState = 'WAITING'
    displayTextString = `${Object.keys(users).length} connected`
  }
}


function randomNum() {
	ranNum = floor(random(2, Object.keys(users).length));
	displayTextString = `In this game, ${ranNum} people have to click their phone`;
}

function replaceText() {
	if (count === ranNum) {
		displayTextString = `${result}, you guys finally made it!!`;
	} else {
    loseArr = [
			`${result} y'all failed, ${count} people clicked`,
			`Only ${count} people clicked this time, try it again!`,
			`Hmm, not good, ${count} people clicked`
		];
		displayTextString = loseArr[Math.floor(random(2))];
	}
}

