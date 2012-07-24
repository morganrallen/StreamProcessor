// silly example that reverses the titles of pages
var http = require('http'),
	StreamProcessor = require("..");

var titleReverse = new StreamProcessor(function(chunk) {
	if(typeof chunk !== "string") chunk = chunk.toString("utf8");
	if(chunk.indexOf("<title") > -1) {
		var m = chunk.match(/<title>(.*)<\/title>/i);
	};

	if(m) {
		var title = m[1].split("").reverse().join("");
		chunk = chunk.replace(m[0], "<title>" + title + "</title>");
	}

	return chunk;
});

http.createServer(function(request, response) {
  delete request.headers['accept-encoding'];
  var proxy = http.createClient(80, request.headers['host'])
  var proxy_request = proxy.request(request.method, request.url, request.headers);
  proxy_request.on('response', function (proxy_response) {
        proxy_response.pipe(titleReverse).pipe(response);
        response.writeHead(proxy_response.statusCode, proxy_response.headers);
  });

  request.pipe(proxy_request);
}).listen(8080);
