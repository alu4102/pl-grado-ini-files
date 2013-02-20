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
      var pretty = JSON.stringify(lexer(contents), undefined, 2);
      
      initialinput.innerHTML = contents;
      finaloutput.innerHTML = pretty;
    }
    r.readAsText(f);
  } else { 
    alert("Failed to load file");
  }
}

function lexer(contents) {
  var blanks    = /^\s+/;
  var iniheader = /^\[([^\]\r\n]+)\]/;
  var comments  = /^[;#](.*)/;
  var nameEqualValue = /^([^=;\r\n]+)=([^;\r\n]*)/;
  var dot       = /^./;

  var input = contents;
  var out = [];
  var m = null;

  while (input) {
    if (m = blanks.exec(input)) {
      input = input.replace(blanks,'');
      out.push({ blanks: m });
    }
    else if (m = iniheader.exec(input)) {
      input = input.replace(iniheader,'');
      out.push({ header: m });
    }
    else if (m = comments.exec(input)) {
      input = input.replace(comments,'');
      out.push({ comments : m });
    }
    else if (m = nameEqualValue.exec(input)) {
      input = input.replace(nameEqualValue,'');
      out.push({ nameEqualValue : m });
    }
    else {
      input = input.replace(dot,'');
      out.push({ dot: m });
    }
  }
  return out;
}

