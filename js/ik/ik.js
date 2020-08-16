import Vector from '../vector/vector2.js'

var interval;
var canvas = document.getElementById("ik");
var arm1Slider = document.getElementById("arm1");
var arm2Slider = document.getElementById("arm2");
var arm3Slider = document.getElementById("arm3");
var armSliders = [arm1Slider, arm2Slider, arm3Slider]
var ctx = canvas.getContext("2d");
var dt = 10
ctx.font = "12px Arial";
var maxIteration = 100
var iterationCount = 0;
setInterval(draw, dt)


var arms = []
var radius = 0
setUpArms()
function setUpArms() {
	arms = []
	radius = 0
	for (var i = 0; i < armSliders.length; i++) {
		var value = armSliders[i].value
		arms.push((new Vector(1, 0)).multiply(value))
		radius = radius + parseInt(value, 10)
	}
}

armSliders.forEach( function(element, index) {
	element.oninput = function() {
		setUpArms()
	}
});
var origin = new Vector(canvas.width/2, canvas.height/2)
var target = new Vector(radius, 0)

function degToRad(theta) {
	return theta * Math.PI / 180;
}

function radToDeg(theta) {
	return theta * 180 / Math.PI;
}
function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.beginPath();
	for (var i = 0; i < armSliders.length; i++) {
		ctx.fillText(armSliders[i].value, 10, 40 + 40 * i)
	}
	ctx.arc(origin.x, origin.y, radius, 0, Math.PI*2);
	ctx.moveTo(origin.x, origin.y);
	var currPointer = new Vector(origin.x, origin.y)
	for (var i = 0; i < arms.length; i++) {
		currPointer = currPointer.add(arms[i])
		ctx.lineTo(currPointer.x, currPointer.y)
	}
	ctx.stroke();
	ctx.closePath();
	ctx.beginPath();
	ctx.arc(origin.x + target.x, origin.y + target.y, 10, 0, Math.PI*2);
	ctx.fill();
	ctx.closePath()
}
	
function iterate() {
	for (var i = arms.length - 1; i >= 0; i--) {
		var end = new Vector();
		var currEnd = new Vector();
		for (var j = 0; j < arms.length; j++) {
			if (j < i) {
				currEnd = currEnd.add(arms[j])
			}
			end = end.add(arms[j])
		}
		if (end.substract(target).length() <= 10) {
			clearInterval(interval)
		}
		var currToEnd = end.substract(currEnd);
		var currToTarget = target.substract(currEnd)
		var lengthMult = currToEnd.length() * currToTarget.length()
		if (lengthMult <= 0.0001) {
			var cosAngle = 1
			var sinAngle = 0
		} else {
			var cosAngle = currToEnd.dot(currToTarget)/lengthMult
			var sinAngle = (currToEnd.x*currToTarget.y - currToEnd.y*currToTarget.x)/lengthMult
		}
		var angle = Math.acos(cosAngle);
		if (sinAngle < 0) {
			angle = -angle;
		}
		arms[i] = arms[i].rotate(angle)
	}
	iterationCount++
	if (iterationCount >= maxIteration) {
			clearInterval(interval)
			iterationCount = 0
			console.log("STOP");
	}
}

canvas.addEventListener('mouseup', function(e) {
	interval = setInterval(iterate, 10);
});

canvas.addEventListener('mousedown', function(e) {
	clearInterval(interval)
	var x = e.pageX - canvas.offsetLeft;
	var y = e.pageY - canvas.offsetTop;
	target = new Vector(x - origin.x, y - origin.y)
});