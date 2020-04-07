const express = require("express");
const Posts = require("./posts-model.js"); // update the path

const router = express.Router();

// handles every request that begins with /api/posts
router.get("/", (req, res) => {
   Posts.find()
      .then((posts) => {
         res.status(200).json(posts);
      })
      .catch((error) => {
         // log error to database
         console.log(error);
         res.status(500).json({
            message: "Error retrieving the posts",
         });
      });
});

router.get("/:id", (req, res) => {
   Posts.findById(req.params.id)
      .then((post) => {
         if (post) {
            res.status(200).json(post);
         } else {
            res.status(404).json({ message: "post not found" });
         }
      })
      .catch((error) => {
         // log error to database
         console.log(error);
         res.status(500).json({
            message: "Error retrieving the post",
         });
      });
});

router.post("/", (req, res) => {
   console.log(req.body);
   Posts.insert(req.body)
      .then((postID) => {
         Posts.findById(postID.id)
            .then((post) => {
               res.status(201).json(post);
            })
            .catch((err) =>
               res.status(500).json({
                  message: "Error getting post after adding it.",
                  id: postID,
               })
            );
      })
      .catch((error) => {
         console.log(error);
         res.status(500).json({
            message: "Error adding the post",
         });
      });
});

router.delete("/:id", (req, res) => {
   const id = req.params.id;

   Posts.remove(id)
      .then((count) => {
         if (count) {
            res.status(200).json({ message: "post deleted" });
         } else {
            res.status(404).json({ message: "post not found" });
         }
      })
      .catch((err) => {
         console.log(err);

         res.status(500).json({ error: "something failed, sorry" });
      });
});

router.put("/:id", (req, res) => {
   const changes = req.body;
   Posts.update(req.params.id, changes)
      .then((count) => {
         if (count) {
            Posts.findById(req.params.id)
               .then((post) => {
                  res.status(200).json(post);
               })
               .catch((err) => {
                  res.status(500).json({
                     errorMessage: "error reading the updated post",
                  });
               });
         } else {
            res.status(404).json({ message: "The post could not be found" });
         }
      })
      .catch((error) => {
         // log error to database
         console.log(error);
         res.status(500).json({
            message: "Error updating the post",
         });
      });
});

// add an endpoint that returns all the messages for a post
// /api/posts/:id/messages
router.get("/:id/comments", (req, res) => {
   Posts.findPostComments(req.params.id)
      .then((messages) => {
         res.status(200).json(messages);
      })
      .catch((err) => {
         res.status(500).json({ errorMessage: "error reading messages" });
      });
});

router.get("/comments/:id", (req, res) => {
   Posts.findCommentById(req.params.id)
      .then((comment) => {
         res.status(200).json(comment);
      })
      .catch((err) => {
         res.status(500).json({ errorMessage: "comment not found" });
      });
});

// add an endpoint for adding new message to a post
router.post("/:id/comments", (req, res) => {
   Posts.insertComment({ ...req.body, post_id: req.params.id })
      .then((commentID) => {
         Posts.findCommentById(commentID.id)
            .then((comment) => {
               res.status(201).json(comment);
            })
            .catch((err) =>
               res
                  .status(500)
                  .json({ message: "Can't find new comment by ID." })
            );
      })
      .catch((err) => {
         console.log(err);
         res.status(500).json({ errorMessage: "error adding comment" });
      });
});

console.log(Posts);
module.exports = router; // make it available for require()
