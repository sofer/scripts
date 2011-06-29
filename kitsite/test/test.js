fs = require('fs');

var thing = {
  say: function(word) {
    console.log(word);
  }
}

var TEST = {

  timestamp: new Date().getTime(),
  source: 'things/'+this.timestamp,
  one: 'one ',
  two: 'two ',
  three: "three ",
  
  do: function() {
    console.log("timestamp: "+ this.timestamp);
    console.log("source: "+ this.source);
    console.log("one, two three: "+ this.one + this.two+this.three + this.timestamp);
  },
  
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

TEST.do();

