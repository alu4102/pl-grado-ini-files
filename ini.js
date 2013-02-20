"use strict"; // Use ECMAScript 5 strict mode in browsers that support it

$(document).ready(function() {
   $("#fileinput").change(calculate);
});

function calculate(evt) {
  var f = evt.target.files[0]; 

  if (f) {
    var r = new FileReader();
    r.onload = function(e) { 
      var contents = e.target.result;
      
      out.className = 'unhidden';
      var tokens = lexer(contents);
      var pretty = tokensToString(tokens);
      
      initialinput.innerHTML = contents;
      finaloutput.innerHTML = pretty;
    }
    r.readAsText(f);
  } else { 
    alert("Failed to load file");
  }
}

var temp = '<li> <span class = "<%= t.type %>"> <%= s %> </span>\n';

function tokensToString(tokens) {
   var r = '';
   for(var i in tokens) {
     var t = tokens[i];
     var s = JSON.stringify(t, undefined, 2);
     s = _.template(temp, {t: t, s: s});
     r += s;
   }
   return '<ol>\n'+r+'</ol>';
}

function lexer(contents) {
  var blanks         = /^\s+/;
  var iniheader      = /^\[([^\]\r\n]+)\]/;
  var comments       = /^[;#](.*)/;
  var nameEqualValue = /^([^=;\r\n]+)=([^;\r\n]*)/;
  var any            = /^(.|\n)*/;

  var input = contents;
  var out = [];
  var m = null;

  while (input) {
    if (m = blanks.exec(input)) {
      input = input.replace(blanks,'');
      out.push({ type : 'blanks', match: m });
    }
    else if (m = iniheader.exec(input)) {
      input = input.replace(iniheader,'');
      out.push({ type: 'header', match: m });
    }
    else if (m = comments.exec(input)) {
      input = input.replace(comments,'');
      out.push({ type: 'comments', match: m });
    }
    else if (m = nameEqualValue.exec(input)) {
      input = input.replace(nameEqualValue,'');
      out.push({ type: 'nameEqualValue', match: m });
    }
    else {
      out.push({ type: 'error', match: input });
      input = input.replace(any,'');
    }
  }
  return out;
}

