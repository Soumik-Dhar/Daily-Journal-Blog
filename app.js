// importing modules
const express = require('express');
const bodyParser = require('body-parser');

// storing ports for production and development
const PORT = (process.env.PORT || 3000);
// array to store blog posts
const posts = [];

const app = express();

// using static files and body-parser
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));
// setting ejs as view engine
app.set("view engine", "ejs");

app.get("/", function(req, res) {
  res.render("home", {
    posts: posts
  });
});

app.get("/about", function(req, res) {
  res.render("about");
});

app.get("/contact", function(req, res) {
  res.render("contact");
});

app.get("/compose", function(req, res) {
  res.render("compose");
});

app.post("/compose", function(req, res) {
  const postData = {
    postTitle: req.body.postTitle,
    postBody: req.body.postBody
  };
  posts.push(postData);
  res.redirect("/");
});

app.get("/posts/:postTitle", function(req, res) {
  let data = {};
  let flag = 0;
  let reg = /[^a-zA-Z0-9]/ig;
  const paramTitle = req.params.postTitle.replace(reg, "").toLowerCase();
  for (const post of posts) {
    const blogTitle = post.postTitle.replace(reg, "").toLowerCase();
    if(paramTitle === blogTitle) {
      data = post;
      flag++;
      break;
    }
  }
  if(flag) {
    res.render("post", {
      postTitle: data.postTitle,
      postBody: data.postBody.replace(/\n/ig, "<br>")
    });
  }
  else {
    console.log("No records!");
    res.redirect("/");  
  }
});

// starting server on PORT
app.listen(PORT, function() {
  console.log("Server running on port " + PORT);
});
