var Stream = require("stream");
var util = require("util");

function StreamProcessor(procFunc, options) {
	this.procFunc = procFunc;
	this.options = options;
	this.writable = true;
	this.paused = false;
}

util.inherits(StreamProcessor, Stream);

StreamProcessor.prototype.pipe = function(dest, options) {
	return Stream.prototype.pipe.call(this, dest, options);
}

StreamProcessor.prototype.write = function(chunk) {
	if(this.paused) return;

	var self = this;

	function emit(chunk) {
		self.emit('data', chunk);
	}

	chunk = this.procFunc(chunk);

	if(chunk === false) {
		return chunk;
	}

	if(typeof chunk === "function") {
		return chunk(emit);
	}
	
	return emit(chunk);
}

StreamProcessor.prototype.end = function(data) {
	if(data) this.write(data);
}

StreamProcessor.prototype.pause = function() {
	this.paused = true;
}

StreamProcessor.prototype.resume = function() {
	this.paused = false;
}

module.exports = StreamProcessor;
