const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const session = require('express-session');
const flash = require('connect-flash');
const mongoose = require('mongoose');
// const { stubFalse } = require("lodash");

const homeStartingContent = "";
const aboutContent = "This simple project is learning about web development including EJS, NodeJS, Express and MongoDB. It has features of CRUD, you can create a journal that has a title and body, view your journal, edit your journal and delete a post from your journal. The design was implemented by bootstrap 3 and customize CSS";
const contactContent = "For Job related or comment about this project you can contact me at jomergirao0987@gmail.com";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(session ({
  secret: 'secret',
  cookie: {maxAge:6000},
  resave:false,
  saveUninitialized: false
}));
app.use(flash());

mongoose.connect('mongodb+srv://jomer-journal:test123@cluster0.acrem.mongodb.net/blogDB', {useNewUrlParser: true, useUnifiedTopology: true});

const postSchema = {
  title: String,
  content: String
 };

 const Post = mongoose.model("Post", postSchema);

 app.get("/", function(req, res){

    Post.find({}, function(err, posts){
      res.render("home", {
        message: req.flash('message'),
        startingContent: homeStartingContent,
        posts: posts
        });
    });

});
 

// app.get("/", function(req, res){
//   res.render("home", {homeContent: homeStartingContent, postContent: posts})
// });

app.get("/about", function(req, res){
  res.render("about",{about: aboutContent} );
});

app.get("/contact", function(req, res){
  res.render("contact",{contact: contactContent} );
});

app.get("/compose", function(req, res){
  res.render("compose" );
});


app.post("/compose", function(req, res){
  
  const post = new Post ({
    title: req.body.postTitle,
    content: req.body.postBody
 
  });
  
  // var post = {
  //   title: req.body.postTitle,
  //   body: req.body.postBody
  // };
  // posts.push(post);
  post.save(function(err){
    if (!err){
      res.redirect("/");
    }
 
  });

})

app.post("/delete", function (req,res){
  const checkedPostId = req.body.postId;

  Post.findByIdAndRemove(checkedPostId, function(err){
    if(!err){
      req.flash('message','Successfully Deleted');
      console.log("Successfully deleted");
      res.redirect("/");
    }
  });
  
});

app.post("/update", function (req,res){
  const checkedPostId = req.body.postId;
  const postTitle = req.body.postTitle;
  const postBody = req.body.postBody;

  Post.findByIdAndUpdate(checkedPostId,{title: postTitle, content: postBody}, function(err){
    if(!err){
      console.log("Successfully Updated");
      res.redirect("/");
    }
  });
});


app.get("/posts/:postId", function(req, res){
  // const requestedTitle = _.lowerCase(req.params.postName);
  const requestedPostId = req.params.postId;
 
  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });
  // posts.forEach(function(post){
  //   const storedTitle = _.lowerCase(post.title);
    

  //   if (storedTitle === requestedTitle){
  //     res.render("post",{title: post.title , body: post.body} );
  //   }

  // });
});



let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started Successfully");
});
