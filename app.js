const express = require("express");
const fs = require("fs/promises");

const {
  topicsRoute
} = require("./db/controllers/data.controller.js")

const app = express();

app.get("/api/topics", topicsRoute);

app.listen(9090, (err) => {
  if (err) console.log("Error running on server")
  else console.log("Server running on port 9090")
})

module.exports = app;