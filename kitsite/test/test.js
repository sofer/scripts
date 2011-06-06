fs = require('fs');

var thing = {
  say: function(word) {
    console.log(word);
  }
}

var TEST = {

  source: 'things/',
  timestamp: new Date().getTime(),
  
  say: function(word) {
    console.log(word);
  },
  
  read: function(func, arg) {
    console.log(this.timestamp);
    func(arg);
    var that = this;
    fs.readdir(this.source, function (err, files) {
      files.forEach(function (filename) {
        var filepath = that.source+filename;
        fs.readFile(filepath, 'utf8', function (err, data) {
          if (err) throw err;
          console.log(filepath)
        });          
      });
    });
  }
  
}


//TEST.read('hi');

TEST.read(TEST.say, 'oy');

