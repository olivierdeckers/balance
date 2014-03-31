var olivierdeckers = {};
olivierdeckers.balance = (function() {
	// easeljs
	var canvas, stage;
	var motor, pendulum;
	
	// Box2d vars
	var b2Vec2 = Box2D.Common.Math.b2Vec2;
	var b2BodyDef = Box2D.Dynamics.b2BodyDef;
	var b2Body = Box2D.Dynamics.b2Body;
	var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
	var b2Fixture = Box2D.Dynamics.b2Fixture;
	var b2World = Box2D.Dynamics.b2World;
	var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
	var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
	var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
	var b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef
	
	var SCALE = 30;
	var TIMESTEP = 1.0/20;
	var world;
	var motorBody, pendulumBody;
	var joint;
	
	var scoreTxt, highscoreTxt;
	var score = 0, highscore = 0;
	var timeOfLastFrame = new Date().getTime();
	
	function getTime() {
		return new Date().getTime();
	}

	var init = function() {
		easelSetup();
		b2Setup();
		
		Ticker.setFPS(60);
		Ticker.addListener(olivierdeckers.balance);
		
		document.onmousemove = move;
		document.ontouchmove = touchMove;
		document.ontouchstart = touchMove;
		
		document.body.addEventListener('touchmove', function(event) {
		  event.preventDefault();
		}, false); 
	}
	
	function move(event) {
		motor.x = event.clientX - canvas.offsetLeft;
		motorBody.SetPosition(new b2Vec2(motor.x / SCALE, motor.y / SCALE));
	}
	
	function touchMove(event) {
		var touch = event.touches[0];
		motor.x = touch.pageX - canvas.offsetLeft;
		motorBody.SetPosition(new b2Vec2(motor.x / SCALE, motor.y / SCALE));
	}
	
	// Create EeaselJS Shapes
	function easelSetup() {
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
		g.drawRect(0, 0, 4, 100);
		pendulum.regX = 2;
		pendulum.regY = 50;
		pendulum.x = canvas.width / 2;
		pendulum.y = canvas.height / 2 + 45;
		stage.addChild(pendulum);
		
		scoreTxt = new Text("Score: 0");
		scoreTxt.x = 20;
		scoreTxt.y = 380;
		stage.addChild(scoreTxt);
		
		highscoreTxt = new Text("Highscore: 0");
		highscoreTxt.x = 850;
		highscoreTxt.y = 380;
		stage.addChild(highscoreTxt);
	}
	
	// Create Box2D bodies and joint
	function b2Setup() {
		world = new b2World(new b2Vec2(0,1), false);
		
		var motorFixture = new b2FixtureDef;
		motorFixture.density = 1;
		motorFixture.restitution = 1;
		motorFixture.shape = new b2CircleShape(10 / SCALE);
		var motorBodyDef = new b2BodyDef;
		motorBodyDef.type = b2Body.b2_kinematicBody;
		motorBodyDef.position.x = motor.x / SCALE;
		motorBodyDef.position.y = motor.y / SCALE;
		motorBody = world.CreateBody(motorBodyDef);
		motorBody.CreateFixture(motorFixture);
		
		var pendulumFixture = new b2FixtureDef;
		pendulumFixture.density = 1;
		pendulumFixture.restitution = 1;
		pendulumFixture.shape = new b2PolygonShape;
		pendulumFixture.shape.SetAsBox(4 / 2 / SCALE, 100 / 2 / SCALE);
		var pendulumBodyDef = new b2BodyDef;
		pendulumBodyDef.type = b2Body.b2_dynamicBody;
		pendulumBodyDef.position.x = pendulum.x / SCALE;
		pendulumBodyDef.position.y = pendulum.y / SCALE;
		pendulumBody = world.CreateBody(pendulumBodyDef);
		pendulumBody.CreateFixture(pendulumFixture);
		
		var jointDef = new b2RevoluteJointDef();
	    jointDef.Initialize(motorBody, pendulumBody, motorBody.GetWorldCenter());
		jointDef.localAnchorA.Set(0, 0);
		jointDef.localAnchorB.Set(0, -45 / SCALE);
	    joint = world.CreateJoint(jointDef);
	}
	
	var twoPi = 2*Math.PI;
	function updateScore() {
		var angle = ((joint.GetJointAngle() % (twoPi)) + twoPi) % (twoPi);
		angle = angle / Math.PI * 180;
		
		if (angle > 120 && angle < 240) {
			var now = getTime();
			score += now - timeOfLastFrame;
			highscore = Math.max(highscore, score);
			
			highscoreTxt.text = "Highscore: " + Math.round(highscore / 1000);
		} else {
			score = 0;
		}
		scoreTxt.text = "Score: " + Math.round(score / 1000);
	}
	
	var tick = function() {
		updateScore();
		
		// calculate new position of pendulum using Box2D
		world.Step(TIMESTEP, 10, 10);
		
		// update pendulum location and rotation
		pendulum.x = pendulumBody.GetPosition().x * SCALE;
		pendulum.y = pendulumBody.GetPosition().y * SCALE;
		pendulum.rotation = pendulumBody.GetAngle() / Math.PI * 180;
		
		stage.update();
		world.ClearForces();
		
		timeOfLastFrame = getTime();
	}
	
	return {
		tick: tick,
		init: init
	}
}());