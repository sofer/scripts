fs = require('fs');

fs.readFile('testin.js', 'utf8', function (err, data) {
  if (err) throw err;
  console.log("TEST: "+ data);
});
