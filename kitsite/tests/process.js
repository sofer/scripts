fs = require('fs');

var json = fs.readFileSync('test.json');
json = JSON.parse(json);
for (var i=0;i<json.length;i++) {
  console.log(i+". "+json[i].nice_id+": "+json[i].subject);
}