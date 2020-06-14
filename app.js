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

// handling mongoose method callbacks and redirecting to required routes
function reroute(err, docs, route, res) {
  if (!err) {
    if (docs) {
      res.redirect(route);
    }
  }
}

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
  // storing post ID from route parameter
  const id = req.params.postId;
  // finding document in posts collection whose _id matches route parameter
  Post.findById(id, function(err, post) {
    if (!err) {
      // rendering the post page to display the full post
      res.render("post", {
        title: post.title,
        // replacing newlines in post content with <br> tag for formatting
        content: stringOps.repNewLine(post.content),
        id: id
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
  // storing data from submitted form
  const formData = req.body;
  // storing title and content of submitted post in a new document
  const post = new Post({
    title: formData.title,
    content: formData.content
  });
  // inserting the document into posts collection
  post.save(function(err, docs) {
    // redirecting to the route containing the post
    const route = "/posts/" + docs._id;
    reroute(err, docs, route, res);
  });
});

// handling GET request from home route
app.post("/edit", function(req, res) {
  // storing post ID from submitted form
  const id = req.body.edit;
  // finding document from posts collection with matching ID
  Post.findById(id, function(err, post) {
    if (!err) {
      // rendering the update page to edit the post
      res.render("update", {
        title: post.title,
        content: post.content,
        id: id
      });
    }
  });
});

app.post("/update", function(req, res) {
  // storing data from submitted form
  const formData = req.body;
  // storing post ID of updated post
  const id = formData.postId
  // storing title and content of updated post
  const post = {
    title: formData.title,
    content: formData.content
  };
  // updating document in posts collection with matching ID
  Post.findByIdAndUpdate(id, post, {
    new: true,
    useFindAndModify: false
  }, function(err, docs) {
    // redirecting to the route containing the post
    const route = "/posts/" + docs._id;
    reroute(err, docs, route, res);
  });
});

app.post("/delete", function(req, res) {
  // storing post ID from submitted form
  const id = req.body.delete;
  // deleting document from posts collection with matching ID
  Post.findByIdAndDelete(id, function(err, docs) {
    // redirecting to home route
    reroute(err, docs, "/", res);
  });
});

// starting server on PORT
app.listen(PORT, function() {
  console.log("Server running on port " + PORT);
});
