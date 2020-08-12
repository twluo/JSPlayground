import Vector from '../vector/vector2.js'

var gravity = new Vector(0, 0.001)
export function BouncingBall(name) {
	var canvas = document.getElementById(name);
	var ctx = canvas.getContext("2d");
	var position = new Vector(10, canvas.height - 10)
	var radius = 10;
	var force = new Vector(0.05, -0.05)
	var velocity = new Vector(0, 0)
	var mass = 10;
	var dt = 10
	var paused = false
	setInterval(update, dt)
	canvas.addEventListener('mousedown',handleMouseDown);
	canvas.addEventListener('mouseup',handleMouseUp);
	
	function update() {
		if (!paused) {
			draw()
			updatePosition()
			checkCollision()
			clearForce()
		}
	}

	function draw() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.beginPath();
		ctx.arc(position.x, position.y, radius, 0, Math.PI*2);
		ctx.fillStyle = "FF0000";
		ctx.fill();
		ctx.closePath();
	}

	function applyForce(newForce) {
		force = force.add(newForce)
	}

	function applyGravity() {
		force = force.add(gravity)
	}

	function clearForce() {
		force = new Vector()
	}

	function updatePosition() {
		var acceleration = force.divide(mass)
		velocity = velocity.add(acceleration.multiply(Math.pow(dt, 2)/2))
		position = position.add(velocity.multiply(dt))
	}

	function checkCollision() {
		if (position.x + radius >= canvas.width && velocity.x >= 0) {
			velocity = velocity.flipX()
		} else if (position.x - radius <= 0 && velocity.x <= 0) {
			velocity = velocity.flipX()
		}
		if (position.y - radius <= 0 && velocity.y <= 0) {
			velocity = velocity.flipY()
		} else if (position.y + radius >= canvas.height && velocity.y >= 0) {
			position.y = canvas.height - radius
			velocity = velocity.flipY()
		}
	}

	function handleMouseDown(e) {
		var x = e.pageX - canvas.offsetLeft;
		var y = e.pageY - canvas.offsetTop;
		position = new Vector(x, y)
		velocity = new Vector(0, 0)
		draw()
		paused = true;
	}
	function handleMouseUp(e) {
		var x = e.pageX - canvas.offsetLeft - position.x;
		var y = e.pageY - canvas.offsetTop - position.y;
		applyForce(new Vector(-x * 0.01, -y * 0.01))
		paused = false;
	}
}

