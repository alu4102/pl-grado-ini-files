"use strict"; // Use ECMAScript 5 strict mode in browsers that support it

$(document).ready(function() {               //cuando se carga el documento se llama a calculate()
   $("#fileinput").change(calculate);
});

function calculate(evt) {        
  var f = evt.target.files[0];               

  if (f) {
    var r = new FileReader();
    r.onload = function(e) { 
      var contents = e.target.result;
      
      var tokens = lexer(contents);                   //lexer genera un array de tokens, los tokens son objetos
      var pretty = tokensToString(tokens);            //convierte los objetos tokens en cadenas
      
      out.className = 'unhidden';
      initialinput.innerHTML = contents;              //en la columna de la izq. volcamos el contenido original
      finaloutput.innerHTML = pretty;                 //en la columna de la dch, volcamos el contenido convertido a string
    }
   r.readAsText(f);                                   //leemos el fichero
  } else { 
    alert("Failed to load file");
  }
}

var temp = '<li> <span class = "<%= token.type %>"> <%= match %> </span>\n';

function tokensToString(tokens) {
   var r = '';
   for(var i=0; i < tokens.length; i++) {
     var t = tokens[i]
     var s = JSON.stringify(t, undefined, 2);               //convertimos el token[i] a cadena
     s = _.template(temp, {token: t, match: s});
     r += s;
   }
   return '<ol>\n'+r+'</ol>';
}

function lexer(input) {
  var blanks         = /^\s+/;
  var iniheader      = /^\[([^\]\r\n]+)\]/;
  var comments       = /^[;#](.*)/;
  var nameEqualValue = /^([^=;\r\n]+)=([^;\r\n]*)/;
  var any            = /^(.|\n)+/;                       //Casa con todo

  var out = [];                                          //Array de tokens                                      
  var m = null;                                          //match

  while (input != '') {
    if (m = blanks.exec(input)) {
      input = input.substr(m.index+m[0].length);         //m.index es el lugar donde ocurrio el matching
      out.push({ type : 'blanks', match: m });
    }
    else if (m = iniheader.exec(input)) {
      input = input.substr(m.index+m[0].length);
      out.push({ type: 'header', match: m });
    }
    else if (m = comments.exec(input)) {
      input = input.substr(m.index+m[0].length);
      out.push({ type: 'comments', match: m });
    }
    else if (m = nameEqualValue.exec(input)) {
      input = input.substr(m.index+m[0].length);
      out.push({ type: 'nameEqualValue', match: m });
    }
    else if (m = any.exec(input)) {
      out.push({ type: 'error', match: m });
      input = '';
    }
    else {
      alert("Fatal Error!"+substr(input,0,20));
      input = '';
    }
  }
  return out;
}

