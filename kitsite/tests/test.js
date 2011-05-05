//auth =  'danny@kitsite.com/token:WZCKATvfrUxiYkxDQMCEMKcsMVVwwAVwMqhxGeL3';
//console.log(new Buffer(auth).toString('base64'));


fs = require('fs');
file = 'json/test.txt';
content = 'nothing';



console.log(file);

//fs.writeFileSync('test.txt, content);


//console.log(path.dirname(file));

//console.log(fs.realpathSync(file));

//fs.unlink('tmp/test.txt', function (err) {
//  if (err) throw err;
//  console.log('successfully deleted');
//});

fs.writeFile(file, content, function(err) {
  if (err) throw err;
  console.log('written '+file);
});

/*
fs.open(, 'a', 666, function( e, id ) {
  fs.write( id, 'string to append to file', null, 'utf8', function(){
    fs.close(id, function(){
      console.log('file closed');
    });
  });
});
/*
*/