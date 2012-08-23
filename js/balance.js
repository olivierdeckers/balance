// easeljs
var canvas;
var stage;

var motor, pendulum;

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
	
	pendulum = new Shape();
	var g = pendulum.graphics;
	g.beginFill("#FF0000");
	g.drawRect(0, 0, 100, 4);
	pendulum.regX = 5;
	pendulum.regY = 2;
	pendulum.rotation = 90;
	pendulum.x = canvas.width / 2;
	pendulum.y = canvas.height / 2;
	stage.addChild(pendulum);
	
	Ticker.setFPS(60);
	Ticker.addListener(window);
}

function tick() {
	if (motor.x < 12) {
		motor.x = 12;
	}
	else if (motor.x > canvas.width - 12) {
		motor.x = canvas.width - 12;
	}
	
	stage.update();
}

document.onmousemove = function(event) {
	motor.x = event.clientX - canvas.offsetLeft;
}