// import your node modules
const express = require("express");
const db = require("./data/db.js");

// middlewares
const cors = require("cors");
const bodyParser = require("body-parser");
const validatePostReq = (req, res, next) => {
  const { title, contents } = req.body;

  // check whether title or contents is empty
  if (!title || !contents) {
    res
      .status(400)
      .json({
        errorMessage: "Please provide title and contents for the post."
      });
  }

  next();
}

// applying middlewares
const server = express();
server.use(cors());
server.use(bodyParser.json());

server.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to my first API" });
});

server.post("/api/posts", validatePostReq, async (req, res) => {
  const { title, contents } = req.body;

  try {
    const { id } = await db.insert({ title, contents });
    const post = await db.findById(id);
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({
      error: "There was an error while saving the post to the database"
    });
  }
});

server.get("/api/posts", async (req, res) => {
  try {
    const posts = await db.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({
      error: "The posts information could not be retrieved."
    })
  }
});

server.get("/api/posts/:id", async (req, res) => {
  const postId = req.params.id;
  try {
    const post = await db.findById(postId);

    if (post.length === 0) {
      res.status(404).json({
        message: "The post with the specified ID does not exist."
      });
    }
    res.status(200).json(post);
  } catch(error) {
    res.status(500).json({
      error: "The post information could not be retrieved."
    });
  }

  db.findById(postId)
    .then(post => {
      if (post.length === 0) {
      } else {
      }
    })
    .catch(error => res.status(500).json(error));
});

server.delete("/api/posts/:id", async(req, res) => {
  const { id } = req.params;

  try {
    const postToDelete = await db.findById(id);
    if (postToDelete.length === 0) {
      res.status(404).json({
        message: "The post with the specified ID does not exist."
      });
    }

    const deleteRes = await db.remove(id);
    if (deleteRes === 1) {
      res.status(200).json(postToDelete);
    }
    // what happen if deleteRes !== 1??
  } catch (error) {
    res.status(500).json({
      error: "The post could not be removed"
    })
  }
});

server.put("/api/posts/:id", (req, res) => {
  const { title, contents } = req.body;
  const postId = req.params.id;

  if (!title && !contents) {
    res
      .status(400)
      .json({ message: "Did not receive title or contents to update" });
  } else {
    db.findById(postId)
      .then(post => {
        if (post.length === 0) {
          res
            .status(404)
            .json({ message: "Cannot find a post with requested id" });
        } else {
          db.update(postId, { title, contents }).then(num => {
            if (num === 1) {
              res.status(200).json({
                ...post[0],
                title,
                contents
              });
            } else {
              res.status(500).json({ message: "Cannot perform update" });
            }
          });
        }
      })
      .catch(error => res.status(500).json(error));
  }
});

server.listen(5000, () => console.log("Server is running on port: 5000"));
