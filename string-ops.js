// function to replace newlines in a string to <br> tag
function repNewLine(str) {
  const reg = /\n/ig;
  str = str.replace(reg, "<br>");
  return str;
}

// exporting functions
exports.repNewLine = repNewLine;
