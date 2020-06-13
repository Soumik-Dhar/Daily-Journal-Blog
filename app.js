// importing modules
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const stringOps = require(__dirname + "/string-ops.js");

// setting up mongodb server URL
const URL = "mongodb://localhost:27017/journalDB";
// connecting to mongodb database
mongoose.connect(URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// storing ports for production and development
const PORT = (process.env.PORT || 3000);

// creating schema and model for posts
const postSchema = {
  title: String,
  content: String
};
const Post = mongoose.model("Post", postSchema);

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
  // finding all documents in posts collection
  Post.find(function(err, posts) {
    if (!err) {
      res.render("home", {
        posts: posts
      });
    }
  })
});

// handling GET request to custom routes
app.get("/posts/:postId", function(req, res) {
  const id = req.params.postId;
  // finding document in posts collection whose _id matches route parameter
  Post.findById(id, function(err, post) {
    if(!err) {
      res.render("post", {
        title: post.title,
        // replacing newlines in post content with <br> tag for formatting
        content: stringOps.repNewLine(post.content)
      });
    }
  });
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
  // storing title and content of submitted post into a new document
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  // inserting new post document into posts collection
  post.save(function(err, docs) {
    if (!err) {
      if (docs) {
        res.redirect("/");
      }
    }
  })
});

// starting server on PORT
app.listen(PORT, function() {
  console.log("Server running on port " + PORT);
});
