import Vector from '../vector/vector2.js'

var gravity = new Vector(0, 0.001)
var scalingFactor = 100000
export function PendulumnBall(name) {
	var canvas = document.getElementById(name);
	var ctx = canvas.getContext("2d");
	var position = new Vector(canvas.width/2, canvas.height/2)
	var radius = 10;
	var force = new Vector(0, 0)
	var velocity = new Vector(0, 0)
	var mass = 10;
	var dt = 10
	var efficiency = 0.9
	var paused = false
	var anchorPoint = new Vector(canvas.width/2, 0)
	var ropeLength = position.substract(anchorPoint).length()
	setInterval(update, dt)
	canvas.addEventListener('mousedown',handleMouseDown);
	canvas.addEventListener('mouseup',handleMouseUp);
	
	function update() {
		draw()
		if (!paused) {
			applyGravity()
			applyTension()
			updatePosition()
			checkCollision()
			clearForce()
		}
	}

	function draw() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.beginPath();
		ctx.arc(anchorPoint.x, anchorPoint.y, 10, 0, Math.PI*2);
		ctx.arc(position.x, position.y, radius, 0, Math.PI*2);
		ctx.fillStyle = "FF0000";
		ctx.fill();
		ctx.closePath();
	}

	function drawLine(origin, direction, scale) {
		var destination = origin.add(direction.multiply(scale))
		ctx.beginPath();
		ctx.moveTo(origin.x, origin.y);
		ctx.lineTo(destination.x, destination.y);
		ctx.stroke();
		ctx.closePath();
	}

	function applyForce(newForce) {
		force = force.add(newForce)
	}

	function applyGravity() {
		applyForce(gravity)
		drawLine(position, gravity, scalingFactor)
	}

	function applyTension() {
		var tensionValue = gravity.length() * position.y / ropeLength
		var centripetalValue = Math.pow(velocity.length(), 2) / ropeLength * mass
		var tension = anchorPoint.substract(position).unit().multiply(tensionValue + centripetalValue)
		applyForce(tension)
		drawLine(position, tension, scalingFactor)
	}

	function clearForce() {
		force = new Vector()
	}

	function updatePosition() {
		var acceleration = force.divide(mass)
		velocity = velocity.add(acceleration.multiply(dt))
		position = position.add(velocity.multiply(dt))
		drawLine(position, force, scalingFactor)
		drawLine(position, acceleration, scalingFactor)
		ropeLength = position.substract(anchorPoint).length()
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
			velocity = velocity.flipY()
		}
	}

	function handleMouseDown(e) {
		paused = true;
	}

	function handleMouseUp(e) {
		var x = e.pageX - canvas.offsetLeft;
		var y = e.pageY - canvas.offsetTop;
		position = new Vector(x, y)
		velocity = new Vector(0, 0)
		ropeLength = position.substract(anchorPoint).length()
		paused = false;
	}
}

