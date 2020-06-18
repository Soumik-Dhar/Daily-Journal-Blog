// function to get current date and time
function getDate(condition) {
  let date = "";
  // setting the dateModified string
  if (condition === "compose") {
    date = "<em>published on </em>";
  } else if (condition === "update") {
    date = "<em>updated on </em>";
  }
  // setting date and time options
  const options = {
    dateOptions: {
      year: "numeric",
      month: "long",
      day: "numeric"
    },
    timeOptions: {
      hour: "2-digit",
      minute: "2-digit"
    }
  };
  // getting current date and time
  const result = {
    date: new Date().toLocaleDateString("en-US", options.dateOptions),
    time: new Date().toLocaleTimeString("en-US", options.timeOptions)
  }
  // creating complete date-time string
  date += result.date + " <em>at</em> " + result.time;
  return date;
}
// function to get number of milliseconds since 1970/01/01 for sorting posts
function getNow() {
  return Date.now();
}
// function to replace newlines in a string to <br> tag with spaces
function repNewLine(str) {
  const reg = /\n/ig;
  const tabs = "<br>&emsp;&emsp;&ensp;";
  // replacing \n with <br> tag and adding 10 spaces per paragraph
  str = tabs + str.replace(reg, tabs);
  return str;
}
// exporting functions
exports.getDate = getDate;
exports.getNow = getNow;
exports.repNewLine = repNewLine;
