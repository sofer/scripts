var http = require('http');

var url = 'http://suggestqueries.google.com/complete/search?client=firefox&hl=it&ie=UTF-8&q=alla%20';

var req = http.get(url, function(res) {
  res.setEncoding('utf8');
  console.log("Got response: " + res.statusCode);
  res.on('data', function (chunk) {
    var body = chunk;
    console.log(body);
  });
});