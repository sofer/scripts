// a node.js script for fetching data from zendesk
// ZEN.importFromZendesk() is working nicely
// currently trying to get ZEN.convert() working
// 31-05-11

http = require('http');
fs = require('fs');

var ZEN = {

  host: 'postcms.zendesk.com',
  port: 80,
  cookie: false,
  base64auth: 'ZGFubnlAa2l0c2l0ZS5jb20vdG9rZW46V1pDS0FUdmZyVXhpWWt4RFFNQ0VNS2NzTVZWd3dBVndNcWh4R2VMMw==',
  //source: 'test/',
  source: 'json/',
  target: 'out/',
  fields: { id: 'nice_id', 
            requestedBy: 'req_name', 
            solvedDate: 'solved_at', 
            description: 'subject', 
            client: 'organization_id', 
            billableDays:'field_177410',
            billTo: 'field_147056' },
  
  baseOptions: function(id,page) {
    var opt = {};
    opt.host = this.host;
    opt.port = this.port;
    opt.path = '/';
    return opt
  },
  
  setCookie: function(func) {
    var that = this;
    var opt = this.baseOptions();
    opt.headers = { 'Authorization' : this.base64auth };
    http.get(opt, function(resp) {
      resp.on('end', function() {
        if (resp.statusCode == '302') { // or 200?
          that.cookie = resp.headers['set-cookie'];
          console.log("Got cookie");
          //func(); // cannot get this to work
          that.allReports();
        } else {
          console.log("Operation failed with response code: "+resp.statusCode)
        }
      });
    });
  },
  
  inspectHeader: function() {
    var opt = this.baseOptions();
    opt.headers = { Authorization : this.base64auth };
    http.get(opt, function(resp) {
      console.log(resp.headers['set-cookie']);      
    })    
  },
  
  get: function(id,page) {
    console.log('trying for ' + id + ', page '+ page);
    if (this.cookie) {
      var opt = this.baseOptions(id,page);
      opt.headers = { cookie : this.cookie };
      opt.path = '/rules/'+id+'.json?page='+page;
      http.get(opt, function(resp) {
        var content = '';
        var path = this.source+id+'-'+page+'.json';
        console.log('Got response: ' + resp.statusCode + ' for ' + id + ', page '+ page);
        resp.on('data', function (chunk) {
          content += chunk;
        });
        resp.on('end', function() {
          if (resp.statusCode == '200') {
            fs.writeFileSync(path, content);
            console.log('Written '+path);    
          } else {
            console.log('Did not write '+path);    
          }
        });
      });
    } else {
      console.log('Giving up. No cookie set for ' + id + ', page '+ page+ ' cookie: '+this.cookie);      
    }
  },
  
  allReports: function() {
    reports = {
      '449562': 50
    }
    for (var report in reports) {
      var pages = reports[report];
      for (var i=1;i<=pages;i++) {
        this.get(report,i);
      }
    }
  },
  
  importFromZendesk: function() {
    this.setCookie(this.allReports);
  },
  
  processResults: function(pages) {
    var summary = [];
    var csv = '';
    for (var page in pages) {
      console.log('Processing '+page);
      var tickets = JSON.parse(pages[page]);
      for (var ticket in tickets) {
        //console.log(tickets[ticket]);
        var entry = {};
        for (var field in this.fields) {
          var val = tickets[ticket][this.fields[field]];
          entry[field] = val;
          switch(field) {
            case 'description':
              val = val.replace(/"/g, '""');
              csv = csv + '"' + val + '",';
              break;
            case 'solvedDate':
              csv = csv + val.slice(0,10) + ',';
              break;
            case 'client':
              if (val === 40584) {
                csv = csv + 'London 2012,';
              } else {
                csv = csv + 'other,';
              }
              break;          
            default:
              csv = csv + tickets[ticket][this.fields[field]]+',';
          }
        }
        summary.push(entry);
        csv = csv+"\n";
      }
    }
    var target = this.target+'out.csv';
    fs.writeFileSync(target, csv);
    //console.log(summary);
    console.log('done');
  },
  
  convert: function() {
    var that = this;
    fs.readdir(this.source, function (err, files) {
      var count = files.length;
      var pages = {};
      files.forEach(function (filename) {
        var filepath = that.source+filename;
        fs.readFile(filepath, 'utf8', function (err, data) {
          if (err) throw err;
          pages[filename] = data;
          count--;
          if (count <= 0) {
            that.processResults(pages);
          }
        });          
      });
    });
  }
  
}

//ZEN.importFromZendesk();

ZEN.convert();



