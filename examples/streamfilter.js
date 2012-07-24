/*
 * This example will create two random output streams.
 * Each one will be colored respectively red and blue.
 * The red Stream source will also be diverted to be upper cased and
 * reversed before being piped back into the stream.
 */
var colors = require("colors");
colors.addSequencer("random", (function() {
  var available = ['bold', 'underline', 'italic', 'inverse', 'grey', 'yellow', 'red', 'green', 'blue', 'white', 'cyan', 'magenta'];

  return function(letter, i, exploded) {
    return letter === " " ? letter : letter[available[Math.round(Math.random() * (available.length - 1))]];
  };
})());

// simple helper that just outputs random strings at interval
var RandomStream = require("./RandomLetterStream");
var StreamProcessor = require("..");

var upperCaseStream = new StreamProcessor(function(chunk) {
	return chunk.toUpperCase();
});


var reverseStream = new StreamProcessor(function(chunk) {
	return function(cb) {
		setTimeout(function() {
			cb(chunk.split("").reverse().splice(1).concat(["\n"]).join(""));
		}, 1000);
	}
});

var redStream = new StreamProcessor(function(chunk) {
	return chunk.red;
});

var redStream2 = new StreamProcessor(function(chunk) {
	return chunk.red;
});

var blueStream = new StreamProcessor(function(chunk) {
	return chunk.blue;
});

var r1 = new RandomStream();
var r2 = new RandomStream();

r1.pipe(redStream).pipe(process.stdout);
// note that because redStream is already being piped to stdout above
// piping it below will cause it to follow the same path.
// this line before can be thought of as a stream diversion, reversing then rejoining the flow
r1.pipe(upperCaseStream).pipe(reverseStream).pipe(redStream);

r2.pipe(blueStream).pipe(process.stdout);
