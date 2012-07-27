var assert = require("assert"),
	vows = require("vows"),
	StreamProcessor = require(".."),
	Stream = require("stream"),
	
	util = require("util");

function BooringStream() {
	this.readable = true;

}
util.inherits(BooringStream, Stream);

BooringStream.prototype.resume = function() {
	for(var i = 0; i < 10; i++)
		this.emit("data", ""+i);
	this.readable = false;
};

function HoldingStream() {
	this.str = "";
}
util.inherits(HoldingStream, Stream);

HoldingStream.prototype.write = function(str) {
	this.str += str;
}

var inc = new StreamProcessor(function(chunk) {
	chunk = parseInt(chunk, 10);
	return ""+chunk++;
});

var boo = new BooringStream;
var dst = new HoldingStream;
var dst2 = new HoldingStream;

boo.pipe(dst);
boo.pipe(inc).pipe(dst2);
boo.resume();

vows.describe("Simple incremental stream").addBatch({
	"Test Booring output": {
		"Checking strings equal": function(b) { assert.notEqual(dst.str, "0123456789"); },
		"Checking processes strings equal": function(b) { assert.notEqual(dst2.str, "12345678910"); }
	}
}).run();


