var canvas;
var stage;

var motor, stang;
var speed = 0;
var accel = 0;

document.onkeyup = keyUp;
document.onkeydown = keyDown;

function init() {
	canvas = document.getElementById('canvas');
	
	stage = new Stage(canvas);
	
	var track = new Shape();
	var g = track.graphics;
	g.beginFill("#000000");
	g.drawRect(0, 0, canvas.width - 20, 4);
	track.regX = canvas.width / 2 - 10;
	track.regY = 2;
	track.x = canvas.width / 2;
	track.y = canvas.height / 2;
	stage.addChild(track);
	
	motor = new Shape();
	var g = motor.graphics;
	g.beginFill('#000000');
	g.drawCircle(0, 0, 10);
	motor.x = canvas.width / 2;
	motor.y = canvas.height / 2;
	stage.addChild(motor);
	
	stang = new Shape();
	var g = stang.graphics;
	g.beginFill("#FF0000");
	g.drawRect(0, 0, 100, 4);
	stang.regX = 5;
	stang.regY = 2;
	stang.rotation = 90;
	stang.x = canvas.width / 2;
	stang.y = canvas.height / 2;
	stage.addChild(stang);
	
	Ticker.setFPS(60);
	Ticker.addListener(window);
}

function tick() {
	if (Math.abs(speed) < 10) {
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