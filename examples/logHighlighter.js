var StreamProcessor = require(".."),
	fs = require("fs"),
	colors = require("colors");

// point to your http access log
var apacheLogStream = fs.createReadStream("/var/log/apache2/access_log", {
	encoding: 'utf8'
});

var httpLogHighlighter = new StreamProcessor(function(chunk) {
	chunk = chunk.split(/(.*) (\[.*\]) "(\w+) (.*) HTTP...." (\d+)/);
	chunk[5] = (chunk[5][0] === "2" || chunk[5][0] === "3") ? chunk[5].green : chunk[5].red;
	return chunk[3] + " " + chunk[4] + " " + chunk[5] + "\n";
});

apacheLogStream
	.pipe(httpLogHighlighter)
	.pipe(process.stdout);
