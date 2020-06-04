// importing modules
const express = require('express');
const bodyParser = require('body-parser');
const stringOps = require(__dirname + "/string-ops.js");

// storing ports for production and development
const PORT = (process.env.PORT || 3000);
// array to store blog posts
const posts = [];

// creating an express app
const app = express();

// using static files and body-parser
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));
// setting ejs as view engine
app.set("view engine", "ejs");

// handling GET request to home route
app.get("/", function(req, res) {
  res.render("home", {
    posts: posts
  });
});

// handling POST request from home route
app.post("/", function(req, res) {
  // deleting post at matching index and redirecting to home route
  for (let i = 0; i < posts.length; i++) {
    if (req.body.title === posts[i].postTitle) {
      posts.splice(i, 1);
      break;
    }
  }
  res.redirect("/");
});

// handling GET request to about route
app.get("/about", function(req, res) {
  res.render("about");
});

// handling GET request to contact route
app.get("/contact", function(req, res) {
  res.render("contact");
});

// handling GET request to compose route
app.get("/compose", function(req, res) {
  res.render("compose");
});

// handling POST request from compose route
app.post("/compose", function(req, res) {
  // getting title and content of submitted post
  const postData = {
    postTitle: req.body.title,
    postBody: req.body.content
  };
  // pushing title and content of new post to posts array
  posts.push(postData);
  res.redirect("/");
});

// handling routing parameters for new posts
app.get("/posts/:postTitle", function(req, res) {
  // converting postTitle in route parameter to lowercase minus special characters and spaces
  const paramTitle = stringOps.toLowerAlphaNum(req.params.postTitle);
  // looping through each post in posts array
  for (const post of posts) {
    // getting post title and content
    const title = post.postTitle;
    // replacing newlines in post content with <br> tag for formatting
    const content = stringOps.repNewLine(post.postBody);
    // converting postTitle in posts array to lowercase minus special characters and spaces
    const blogTitle = stringOps.toLowerAlphaNum(title);
    // rendering post if post title in url matches that in posts array
    if (paramTitle === blogTitle) {
      res.render("post", {
        postTitle: title,
        postBody: content
      });
      break;
    }
    // redirecting to home route if post titles do not match
    else {
      console.log("No posts found!");
      res.redirect("/");
    }
  }
});

// starting server on PORT
app.listen(PORT, function() {
  console.log("Server running on port " + PORT);
});
