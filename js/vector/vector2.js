export default function Vector2(x, y) {
	this.x = x || 0;
	this.y = y || 0;
}

Vector2.prototype = {
	negative: function() {
		return new Vector2(-this.x, -this.y);
	},
	add: function(v) {
		if (v instanceof Vector2) return new Vector2(this.x + v.x, this.y + v.y);
		else return new Vector2 (this.x + v, this.y + v);
	},
	substract: function(v) {
		if (v instanceof Vector2) return new Vector2(this.x - v.x, this.y - v.y);
		else return new Vector2 (this.x - v, this.y - v);
	},
	multiply: function(v) {
		if (v instanceof Vector2) return new Vector2(this.x * v.x, this.y * v.y);
		else return new Vector2 (this.x * v, this.y * v);
	},
	divide: function(v) {
		if (v instanceof Vector2) return new Vector2(this.x / v.x, this.y / v.y);
		else return new Vector2 (this.x / v, this.y / v);
	},
	equals: function(v) {
		if (v instanceof Vector2) return this.x == v.x && this.y == v.y;
		else return this.x == this.y == v;
	},
	dot: function(v) {
		return this.x * v.x + this.y * v.y;
	},
	length: function() {
		return Math.sqrt(this.dot(this));
	},
	unit: function() {
		return this.divide(this.length());
	},
	flipX: function() {
		return new Vector2(-this.x, this.y)
	},
	flipY: function() {
		return new Vector2(this.x, -this.y)
	},
	init: function(x, y) {
		this.x = x; this.y = y;
		return this
	},
	rotate: function(theta) {
		var newX = this.x * Math.cos(theta) - this.y * Math.sin(theta);
		var newY = this.x * Math.sin(theta) + this.y * Math.cos(theta);
		return new Vector2(newX, newY)
	}
}