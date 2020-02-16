// Open and connect output socket
let socket = io('/output');

// Listen for confirmation of connection
socket.on('connect', function() {
	console.log('Connected');
});

let users = {};
let participants = 10;
let canClick = false;
let ranNum;
let count, result;
let displayText;

let sec = 5;
let isInGame = false;
let loseArr = [];

function setup() {
	noCanvas();
	let startButton = createButton('start game');
	startButton.mousePressed(startGame);
	displayText = createP('');
	displayText.class('content');

	socket.on('inputValue', (message) => {
		let id = message.id;
		let data = message.data;

		if (!(id in users)) {
			users[id] = {
				value : data
			};
		}
		count = 0;
		for (id in users) {
			if (users[id].value == 1) {
				count += 1;
			}
		}
		count == ranNum ? (result = `Wow`) : (result = `Uh Oh`);
		loseArr = [
			`${result} y'all failed, ${count} people clicked`,
			`Only ${count} people clicked this time, try it again!`,
			`Hmm, not good, ${count} people clicked`
		];
	});
}

function startGame() {
  if (isInGame === true) {
    // do nothing
    console.log('game already started')
    return;
  }

	isInGame = true;
	randomNum();
	let timer = setInterval(() => {
		sec--;
		canClick = true;
		if (sec < 0) {
			clearInterval(timer);
			canClick = false;
			sec = 5;
			replaceText();
			isInGame = false;
		}
		socket.emit('click', canClick);
		console.log(sec);
	}, 1000);
}

function randomNum() {
	ranNum = floor(random(2, participants));
	displayText.html(`In this game, ${ranNum} people have to click their phone`);
}

function replaceText() {
	if (count == ranNum) {
		displayText.html(`${result}, you guys finally made it!!`);
	} else {
		displayText.html(loseArr[Math.floor(random(2))]);
	}
}

// set a boolean for not clicking start button while the program is running
