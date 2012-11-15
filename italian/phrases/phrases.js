/* 
a node.js script for creating lists of phrases based on single words and google automcomplete
1. load list of terms
2. do google search for each term (in appropriate language)
e.g. http://google.com/complete/search?q=alla%20&output=toolbar&hl=it
or   http://google.com/complete/search?q=all'&output=toolbar&hl=it
3. select preferred term from list, as follows:
- create a stop list of connecting words
 - take second (and, if it's a stop word then add the third) word of each suggestion
 - search for that word in the list and note its position
 - allow verb lemmas
 - for all phrases with words that appear in the list, add an entry for that word
 - capitalise the first letter
 - add a full stop
4. translate the complete term, using google translate api
 - include variants: 1) with no punctuation; 2) with capital letter; 3) with full stop
5. save results
 - add the results to each term
*/

var http = require('http');
var https = require('https');
var fs = require('fs');

var trailingspace = '%20'
var auth = 'AIzaSyDUVq59xWfGNf9SPcx3U-SQKXlYDng0CfY';
var wordFile = 'words.txt';
var suggestionsFile = 'suggestions.js';
var shortlistFile = 'shortlist.js';
var translatedFile =  'translated.js';
var finalFile =  'phrases.txt';
var stopWords = [];

var TRANSLATE = {

  autocompleteURL: 'http://suggestqueries.google.com/complete/search?client=firefox&hl=it&oe=utf-8&q=',
  translateURL: 'https://www.googleapis.com/language/translate/v2?key=AIzaSyDUVq59xWfGNf9SPcx3U-SQKXlYDng0CfY&source=it&target=en&q=',
  wordFile: wordFile,
  suggestionsFile: suggestionsFile,
  shortlistFile: shortlistFile,
  translatedFile: translatedFile,
  finalFile: finalFile,
  words: [],
  suggestions: [],
  shortlist: [],
  wordOrder: {},
  translations: [],
  
  saveResults: function() {
    var results = JSON.stringify(this.suggestions);
    fs.writeFileSync(this.suggestionsFile, results);
    console.log("Done.");
  },
  
  getPhrases: function(word) {
    console.log('trying for ' + word);
    var that = this;
    var url = this.autocompleteURL + word + trailingspace;
    var req = http.get(url, function(res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        var body = chunk;
        that.suggestions.push(JSON.parse(body));
        that.count--;
        console.log(that.count+" searches to go");
        if (that.count <= 0) {
          that.saveResults();
        }
      });
    });
    req.on('error', function(e) {
      console.log("Got error: " + e.message);
    });
  },
  
  autocomplete: function() {
    for (word in this.words) {
      this.getPhrases(this.words[word]);
    } 
  },
  
  words: function() {
    data = fs.readFileSync(this.wordFile, 'utf8');
    this.words = data.split("\n");
    this.count = this.words.length;
    this.autocomplete();
  },

  mode1: function(suggestion) {
    var words = suggestion.split(' ');
    if (this.wordOrder[words[0]] && this.wordOrder[words[1]]) { // 1st 2 words in list
      if (words[1].length <= 5 && this.wordOrder[words[2]]) { // 2nd word is short and 3rd word in list
        if (words[2].length <= 5 && this.wordOrder[words[3]]) { // 3nd word is short and 4th word in list
          this.shortlist.push(words[0]+' '+words[1]+' '+words[2]+' '+words[3]);
        } else {
          this.shortlist.push(words[0]+' '+words[1]+' '+words[2]);
        }
      } else {
        this.shortlist.push(words[0]+' '+words[1]);
      }
    } else {
      this.shortlist.push(words[0]);
    }
  },

  mode2: function(suggestion) {
    var words = suggestion.split(' ');
    var includeThis = true;
    for (word in words) {
      if (!this.wordOrder[words[word]]) {
        includeThis = false;
      }
    }
    if (includeThis) {
      this.shortlist.push(suggestion);
    }
  },

  mode3: function(suggestion) {},


  //take the suggestions and refine them
  refinePhrases: function() {
    this.shortlist = [];
    var data = fs.readFileSync(this.suggestionsFile, 'utf8');
    this.suggestions = JSON.parse(data);
    for (i in this.suggestions) {
      for (var j in this.suggestions[i][1]) {
        var suggestion = this.suggestions[i][1][j];
        this.mode2(suggestion);
      }
    }
    fs.writeFileSync(this.shortlistFile, JSON.stringify(this.shortlist));
  },

  shortlist: function() {
    data = fs.readFileSync(this.wordFile, 'utf8');
    this.words = data.split("\n");
    for (var ord in this.words) {
      this.wordOrder[this.words[ord]] = ord;  
    }
    this.refinePhrases();
    console.log('Done');
  },
  
  saveTranslations: function() {
    var translations = JSON.stringify(this.translations);
    fs.writeFileSync(this.translatedFile, translations);
    console.log("Translation done.");
  },
  
  translate: function() {
    var that = this;
    var data = fs.readFileSync(this.shortlistFile, 'utf8');
    var shortlist = JSON.parse(data);
    this.count = shortlist.length;
    for (ord in shortlist) {
      var phrase = shortlist[ord];
      if (phrase.length > 23) {
        this.count--;
      } else {
        //phrase = '"'+phrase.charAt(0).toUpperCase() + phrase.slice(1) + '."';
        var url = this.translateURL + phrase;
        (function(ph) {
          var req = https.get(url, function(res) {
            that.count--;
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
              var body = chunk;
              translation = JSON.parse(body);
              targetPhrase = translation.data.translations[0].translatedText;
              that.translations.push([ph, targetPhrase]);
              if (that.count <= 0) {
                that.saveTranslations();
              }
            });
          });
          req.on('error', function(e) {
            console.log("Got error: " + e.message);
          });
        })(phrase);
      }
    }
  },
  
  toText: function() {
    var text = '';
    var data = fs.readFileSync(this.translatedFile, 'utf8');
    var phrases = JSON.parse(data);
    for (var phrase in phrases) {
      text += phrases[phrase][0] + "\t" + phrases[phrase][1] + "\n";
    }
    fs.writeFileSync(this.finalFile, text);
  },
  
  googletest: function() {
    var phrase = 'può dirmi';
    console.log('trying for ' + phrase);
    var that = this;
    var url = this.translateURL + phrase;
    var req = https.get(url, function(res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        var body = chunk;
        translation = JSON.parse(body);
        console.log(translation.data.translations[0].translatedText);
      });
    });
    req.on('error', function(e) {
      console.log("Got error: " + e.message);
    });
  }

}

//TRANSLATE.words();
//TRANSLATE.shortlist();
//TRANSLATE.translate();
//TRANSLATE.googletest();
TRANSLATE.toText();

