import Vector from '../vector/vector2.js'

var gravity = new Vector(0, 0.001)
export function OrbitBall(name) {
	var canvas = document.getElementById(name);
	var ctx = canvas.getContext("2d");
	var position = new Vector(10, canvas.height - 10)
	var radius = 10;
	var force = new Vector(0.05, -0.05)
	var velocity = new Vector(0, 0)
	var mass = 10;
	var dt = 10
	var efficiency = 0.9
	var paused = false
	setInterval(update, dt)
	canvas.addEventListener('mousedown',handleMouseDown);
	canvas.addEventListener('mouseup',handleMouseUp);
	
	function update() {
		draw()
		if (!paused) {
			applyGravity()
			updatePosition()
			checkCollision()
			clearForce()
		}
	}

	function draw() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.beginPath();
		ctx.arc(canvas.width/2, canvas.height/2, 30, 0, Math.PI*2);
		ctx.arc(position.x, position.y, radius, 0, Math.PI*2);
		ctx.fillStyle = "FF0000";
		ctx.fill();
		ctx.closePath();
	}

	function applyForce(newForce) {
		force = force.add(newForce)
	}

	function applyGravity() {
		var center = new Vector(canvas.width/2, canvas.height/2)
		var direction = center.substract(position)
		var directionLength = direction.length()
		direction = direction.divide(directionLength)
		var gravitationalForce = direction.multiply(mass * 0.01/directionLength)
		force = force.add(gravitationalForce)
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
			velocity = velocity.multiply(efficiency)
		} else if (position.x - radius <= 0 && velocity.x <= 0) {
			velocity = velocity.flipX()
			velocity = velocity.multiply(efficiency)
		}
		if (position.y - radius <= 0 && velocity.y <= 0) {
			velocity = velocity.flipY()
			velocity = velocity.multiply(efficiency)
		} else if (position.y + radius >= canvas.height && velocity.y >= 0) {
			velocity = velocity.flipY()
			velocity = velocity.multiply(efficiency)
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
		applyForce(new Vector(-x * 0.001, -y * 0.001))
		paused = false;
	}
}

