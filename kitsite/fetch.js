//http: require('http'),
//fs: require('fs'),

var http = require('http');

ZEN = {

  id: '449562',
  filename: 'test.json',
  host: 'postcms.zendesk.com',
  base_path: '/rules/'+this.id+'.json&page=',
  auth: 'ZGFubnlAa2l0c2l0ZS5jb20vdG9rZW46V1pDS0FUdmZyVXhpWWt4RFFNQ0VNS2NzTVZWd3dBVndNcWh4R2VMMw==',
  base_options: {
    host: this.host,
    port: 80,
    path: this.base_path,
    headers: { 'Authorization' : this.base64auth }
  },

  fetch: function(page) {
    var options = this.base_options;
    options.path = this.base_path + page;
    require('http').get(this.options, function(resp) {
      var content = '';
      console.log("Got response: " + resp.statusCode);
      resp.on('data', function (chunk) {
        content += chunk;
      });
      resp.on('end', function() {
        fs.writeFileSync(filename, content);
        console.log("Written "+filename);    
      });
    });
  }
  
}

ZEN.fetch(1);



/*
var content = '';
http.get(options, function(resp) {
  console.log("Got response: " + resp.statusCode);
  resp.on('data', function (chunk) {
    content += chunk;
    console.log("SO FAR: "+content);
    //console.log("DONE\n");
  });
}).on('error', function(e) {
  console.log("Got error: " + e.message);
});

//console.log("FINALLY: "+content);

//fs.writeFileSync(filename, content);
//console.log("<br>Saved "+filename);    



/*
curl -u danny@kitsite.com/token:WZCKATvfrUxiYkxDQMCEMKcsMVVwwAVwMqhxGeL3 http://postcms.zendesk.com/rules/449562.json

curl -H 'Authorization: Basic ZGFubnlAa2l0c2l0ZS5jb20vdG9rZW46V1pDS0FUdmZyVXhpWWt4RFFNQ0VNS2NzTVZWd3dBVndNcWh4R2VMMw==' http://postcms.zendesk.com/rules/449562.json

base64_encode($auth)

request.on('response', function (response) {
  console.log('STATUS: ' + response.statusCode);
  console.log('HEADERS: ' + JSON.stringify(response.headers));
  response.setEncoding('utf8');
  response.on('data', function (chunk) {
    console.log('BODY: ' + chunk);
  });
});

*/