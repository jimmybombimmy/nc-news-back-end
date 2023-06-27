const express = require("express");
const serverInfo = require("./db/server.js")
const {
  getTopics
} = require("./db/controllers/data.controller.js")

const app = express();

app.set('view engine', 'ejs')

app.get("/api/topics", getTopics);

serverInfo(app)

module.exports = app;