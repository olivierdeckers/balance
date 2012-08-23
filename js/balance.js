var canvas;
var stage;

var motor;
var speed = 0;
var accel = 0;

document.onkeyup = keyUp;
document.onkeydown = keyDown;

function init() {
	canvas = document.getElementById('canvas');
	
	stage = new Stage(canvas);
	
	var track = new Shape();
	g = track.graphics;
	g.beginFill("#000000");
	g.drawRect(0, 0, canvas.width - 20, 4);
	track.x = canvas.width / 2;
	track.y = canvas.height / 2;
	track.regX = canvas.width / 2 - 10;
	track.regY = 2;
	stage.addChild(track);
	
	motor = new Shape();
	var g = motor.graphics;
	g.beginFill('#000000');
	g.drawRect(0, 0, 20, 20);
	motor.x = canvas.width / 2;
	motor.y = canvas.height / 2;
	motor.regY = 10;
	motor.regX = 10;
	stage.addChild(motor);
	
	Ticker.setInterval(20);
	Ticker.addListener(window);
}

function tick() {
	if (speed < 10) {
		speed += accel;
	}
	if (motor.x + speed > 12 && motor.x + speed < canvas.width - 12) {
		motor.x += speed;
	}
	
	stage.update();
}


function keyUp() {
	if (speed < 0 && event.keyCode === 37) {
		speed = 0;
		accel = 0;
	}
	else if (speed > 0 && event.keyCode === 39) {
		speed = 0;
		accel = 0;
	}
}

var maxAccel = 0.5;
function keyDown() {
	switch(event.keyCode) {
		case 37: //left
			accel = -maxAccel;
		break;
		case 39: //right
			accel = maxAccel;
		break;
	}
}