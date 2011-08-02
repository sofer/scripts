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
  timestamp: new Date().getTime(),
  source: 'json/',
  target: 'out/',
  pagesProcessed: 0,
  pages: 1,
  pagesToGo: 0,
  report: '449562',
  fields: { id: 'nice_id'
            , requestedBy: 'req_name'
            , status: 'status_id'
            , solvedDate: 'solved_at'
            , updatedDate: 'updated_at' 
            , description: 'subject'
            , client: 'organization_id'
            , billableDays:'field_177410'
            , billing: 'field_147056' 
            , comments: 'comments' 
            },
  
  baseOptions: function(id,page) {
    var opt = {};
    opt.host = this.host;
    opt.port = this.port;
    opt.path = '/';
    return opt
  },
  
  fetch: function() { 
    var that = this;
    var opt = this.baseOptions();
    opt.headers = { 'Authorization' : this.base64auth };
    http.get(opt, function(resp) {
      resp.on('end', function() {
        if (resp.statusCode == '302') { // or 200?
          that.cookie = resp.headers['set-cookie'];
          console.log("Got cookie");
          that.importFromZendesk();
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
  
  get: function(page) {
    console.log('trying for ' + this.report + ', page '+ page);
    if (this.cookie) {
      var that = this;
      var opt = this.baseOptions(this.report,page);
      opt.headers = { cookie : this.cookie };
      opt.path = '/rules/'+this.report+'.json?page='+page;
      http.get(opt, function(resp) {
        var content = '';
        var path = that.source+that.timestamp+'/'+that.report+'-'+page+'.json';
        console.log('Got response: ' + resp.statusCode + ' for ' + that.report + ', page '+ page);
        resp.on('data', function (chunk) {
          content += chunk;
        });
        resp.on('end', function() {
          that.pagesToGo--;    
          console.log(that.pagesToGo+' pages to go');
          if (resp.statusCode == '200') {
            fs.writeFileSync(path, content);
            console.log('Written '+path);
          } else {
            console.log('Did not write '+path);    
          }
          if (that.pagesToGo == 0) {
            console.log('No more pages left. Converting now.')
            that.convert();
          }
        });
      });
    } else {
      console.log('Giving up. No cookie set for ' + id + ', page '+ page+ ' cookie: '+this.cookie);      
    }
  },
  
  importFromZendesk: function() {
    this.pagesToGo = this.pages;
    fs.mkdirSync(this.source+this.timestamp, 0755);
    for (var page=1;page<=this.pages;page++) {
      this.get(page);
    }
  },
  
  update: function(report,pages) {
    this.report = report;
    this.pages = pages;
    this.fetch();
  },
  
  processResults: function(pages) {
    var summary = [];
    var csv = "date,id,status,requested by,description,client,capped,retainer,ODA,TSD,TFL,Festival,Bill separately,other\n";
    for (var page in pages) {
      console.log('Processing '+page);
      var tickets = JSON.parse(pages[page]);
      for (var ticket in tickets) {
        var line = '';
        var status = tickets[ticket][this.fields.status];
        switch(status) {
          case 0:
          status ='new';
          break;
          case 1:
          status ='open';
          break;
          case 2:
          status ='pending';
          break;
          default:
          status ='solved';
        }
        line += tickets[ticket][this.fields.id]+',';
        line += status+',';
        line += tickets[ticket][this.fields.requestedBy]+',';
        line += '"'+tickets[ticket][this.fields.description].replace(/"/g, '""')+'",';
        if (tickets[ticket][this.fields.client] === 40584) {
          line += 'London 2012,';
          if (status === 'solved') {
            line += tickets[ticket][this.fields.solvedDate].slice(0,10)+',';
            var billing = tickets[ticket][this.fields.billing]; 
            if (billing === 'capped') {
              line += '1,,,,,,';
            } else {
              var days = tickets[ticket][this.fields.billableDays];
              if (days !== null && days > 0) {
                switch(billing) {
                  case 'billable':
                  line += ','+days+',,,,,,';
                  break;
                  case 'bill_to_oda':
                  line += ',,'+days+',,,,,';
                  break;
                  case 'bill_to_its': // no longer in use
                  line += ',,,'+days+',,,,';
                  break;
                  case 'bill_to_cts': // no longer in use
                  line += ',,,'+days+',,,,';
                  break;
                  case 'bill_to_tsd':
                  line += ',,,'+days+',,,,';
                  break;
                  case 'bill_to_tfl':
                  line += ',,,,'+days+',,,';
                  break;
                  case 'bill_to_festival':
                  line += ',,,,,'+days+',,';
                  break;
                  case 'bill_separately':
                  line += ',,,,,,'+days+',';
                  break;
                  default:
                  line += ',,,,,,'+days;
                }
              }
            }
          } else {
            line += tickets[ticket][this.fields.updatedDate].slice(0,10)+',';
            var comments = tickets[ticket][this.fields.comments]; 
            var lastComment = comments[comments.length-1].value.substr(0,200);
            line += '"'+lastComment+'"';
          }
        }
        csv += line + "\n";
      }
    }
    var target = this.target+this.timestamp+'.csv';
    fs.writeFileSync(target, csv);
    console.log('Written '+target);
  },
  
  test: function() {
    console.log(this.timestamp);
  },
  
  convert: function() {
    var that = this;
    fs.readdir(this.source+this.timestamp, function (err, files) {
      var count = files.length;
      var pages = {};
      files.forEach(function (filename) {
        var filepath = that.source+that.timestamp+'/'+filename;
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

//ZEN.test();

// DO the whole lot
//ZEN.all();
// do just the latest
var pages = 5;
var report = '449562'; // closed tickets
//report = '23031103'; // 2012 open tickets
ZEN.update(report,pages);



