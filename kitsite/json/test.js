var fs = require('fs');

var filename = '449562-1.json';

fs.readFile(filename, function (data) {
  console.log(data);
});
