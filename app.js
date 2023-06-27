const express = require("express");
const {
  getTopics
} = require("./db/controllers/data.controller.js")

const app = express();

app.get("/api/topics", getTopics);

module.exports = app;