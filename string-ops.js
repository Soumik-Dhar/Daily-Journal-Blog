// function to remove all special characters from a string and convert it to lowercase
function toLowerAlphaNum(str) {
  // removing all special characters and spaces
  const reg = /[^a-zA-Z0-9]/ig;
  str = str.replace(reg, "");
  // converting str to lowercase
  str = str.toLowerCase();
  return str;
}

// function to replace newlines in a string to <br> tag
function repNewLine(str) {
  const reg = /\n/ig;
  str = str.replace(reg, "<br>");
  return str;
}

// exporting functions
exports.toLowerAlphaNum = toLowerAlphaNum;
exports.repNewLine = repNewLine;
