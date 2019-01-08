// import your node modules
const express = require("express");
const db = require("./data/db.js");

// Error messages
const errorMessage = {
  inputError: {
    errorMessage: "Please provide title and contents for the post."
  },
  savingError: {
    error: "There was an error while saving the post to the database"
  },
  fetchingError: { error: "The posts information could not be retrieved." },
  noPostError: { message: "The post with the specified ID does not exist." },
  removingError: { error: "The post could not be removed" },
  modifyingError: { error: "The post information could not be modified." }
};

// middlewares
const cors = require("cors");
const bodyParser = require("body-parser");

// custom middleware
const validatePostReq = (req, res, next) => {
  const { title, contents } = req.body;

  // check whether title or contents is empty
  if (!title || !contents) {
    res.status(400).json(errorMessage.inputError);
  }

  next();
};

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
    res.status(500).json(errorMessage.savingError);
  }
});

server.get("/api/posts", async (req, res) => {
  try {
    const posts = await db.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json(errorMessage.fetchingError);
  }
});

server.get("/api/posts/:id", async (req, res) => {
  const postId = req.params.id;
  try {
    const post = await db.findById(postId);

    if (post.length === 0) {
      res.status(404).json(errorMessage.noPostError);
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json(errorMessage.fetchingError);
  }

  db.findById(postId)
    .then(post => {
      if (post.length === 0) {
      } else {
      }
    })
    .catch(error => res.status(500).json(error));
});

server.delete("/api/posts/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const postToDelete = await db.findById(id);
    if (postToDelete.length === 0) {
      res.status(404).json(errorMessage.noPostError);
    }

    const deleteRes = await db.remove(id);
    if (deleteRes === 1) {
      res.status(200).json(postToDelete);
    }
    // what happen if deleteRes !== 1??
  } catch (error) {
    res.status(500).json(errorMessage.removingError);
  }
});

server.put("/api/posts/:id", validatePostReq, async (req, res) => {
  const { title, contents } = req.body;
  const { id } = req.params;

  try {
    const postToUpdate = await db.findById(id);
    if (postToUpdate.length === 0) {
      res.status(404).json(errorMessage.noPostError);
    }
    await db.update({ title, contents });
    const updatedPost = await db.findById(id);
    res.status(200).json({ updatedPost });
  } catch (error) {
    res.status(500).json(errorMessage.modifyingError);
  }
});

server.listen(5000, () => console.log("Server is running on port: 5000"));
