// Open and connect input socket
let socket = io('/input');
socket.on('connect', () => {
	console.log('Connected');
});

// touch then change background color, value = 1
// after touch can't change value anymore / background until timer stops
let value = 0;
let r, g, b;
let touched = false;
let canTouch = false;

let timeInSec = 10;

function setup() {
	createCanvas(windowWidth, windowHeight);
	background(255);

	socket.on('click', (data) => {
		// console.log(data);
		if (data === true) {
			canTouch = true;
		} else {
			resetGame();
		}
		console.log(canTouch);
	});
}

function touchStarted() {
	if (touched == false && canTouch == true) {
		changeColorValue();
		value = 1;
		socket.emit('inputValue', value);
		touched = true;
	}
	//prevent default;
	return false;
}

function changeColorValue() {
	r = Math.floor(Math.random() * 255);
	g = Math.floor(Math.random() * 255);
	b = Math.floor(Math.random() * 255);
	background(r, g, b);
}

function resetGame() {
	canTouch = false;
	touched = false;
	background(255);
}
