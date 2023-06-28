const express = require("express");
const {
  getTopics,
  getApiInfo,
  getSoleArticle
} = require("./db/controllers/data.controller.js")
const {errorHandlers} = require("./db/errors.js")

const app = express();

app.get('/api', getApiInfo)

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getSoleArticle)

app.use(errorHandlers);

module.exports = app;