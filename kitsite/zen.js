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
  source: 'json/' + new Date().getTime(),
  target: 'out/',
  fields: { id: 'nice_id', 
            requestedBy: 'req_name', 
            solvedDate: 'solved_at', 
            description: 'subject', 
            client: 'organization_id', 
            billableDays:'field_177410',
            billing: 'field_147056' },
  
  baseOptions: function(id,page) {
    var opt = {};
    opt.host = this.host;
    opt.port = this.port;
    opt.path = '/';
    return opt
  },
  
  fetch: function(pages) {  
    var that = this;
    var opt = this.baseOptions();
    opt.headers = { 'Authorization' : this.base64auth };
    http.get(opt, function(resp) {
      resp.on('end', function() {
        if (resp.statusCode == '302') { // or 200?
          that.cookie = resp.headers['set-cookie'];
          console.log("Got cookie");
          that.importFromZendesk(pages);
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
      var that = this;
      var opt = this.baseOptions(id,page);
      opt.headers = { cookie : this.cookie };
      opt.path = '/rules/'+id+'.json?page='+page;
      http.get(opt, function(resp) {
        var content = '';
        var path = that.source+'/'+id+'-'+page+'.json';
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
  
  importFromZendesk: function(pages) {
    reports = {
      '449562': pages
    }
    fs.mkdirSync(this.source, 0755);
    for (var report in reports) {
      var pages = reports[report];
      for (var i=1;i<=pages;i++) {
        this.get(report,i);
      }
    }
  },
  
  all: function() {
    this.fetch(50);
  },

  update: function() {
    this.fetch(1);
    this.convert();
  },
  
  processResults: function(pages) {
    var summary = [];
    var csv = "date,id,requested by,description,client,capped,retainer,ODA,CTS,TFL,Festival,Bill separately,other\n";
    for (var page in pages) {
      console.log('Processing '+page);
      var tickets = JSON.parse(pages[page]);
      for (var ticket in tickets) {
        var line = '';
        line += tickets[ticket][this.fields.solvedDate].slice(0,10)+',';
        line += tickets[ticket][this.fields.id]+',';
        line += tickets[ticket][this.fields.requestedBy]+',';
        line += '"'+tickets[ticket][this.fields.description].replace(/"/g, '""')+'",';
        if (tickets[ticket][this.fields.client] === 40584) {
          line += 'London 2012,';
          var billing = tickets[ticket][this.fields.billing]; 
          if (billing === 'capped') {
            line += 1+',,,,,,';
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
                case 'bill_to_its':
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
            } else {
              line += ',,,,,,,';
            }
          }
        } else {
          line += 'other,,,,,,';
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
    console.log(this.source);
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

//ZEN.test();

// DO the whole lot
//ZEN.all();
// do just the latest
ZEN.update()



