var Stream = require("stream");
var util = require("util");

function rnd(len) {
	return Math.round(Math.random() * len);
}

function RandomStream() {
	this.readable = true;

	var self = this;
	setInterval(function() {
		var len = rnd(100), str = "";
		for(var i = len; len >= 0; len--)
			str += String.fromCharCode(96 + rnd(26));
		self.emit("data", str + "\n");
	}, 750 + rnd(500));
}

util.inherits(RandomStream, Stream);

module.exports = RandomStream;
