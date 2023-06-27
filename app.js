const express = require("express");
const {
  getTopics,
  getApiInfo
} = require("./db/controllers/data.controller.js")

const app = express();

app.get('/api', getApiInfo)

app.get("/api/topics", getTopics);

module.exports = app;