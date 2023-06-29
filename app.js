const express = require("express");
const {
  getTopics,
  getApiInfo,
  getSoleArticle,
  getAllArticles,
  getArticlesComments
} = require("./db/controllers/data.controller.js")
const {errorHandlers} = require("./db/errors.js")

const app = express();

app.get("/api", getApiInfo)

app.get("/api/topics", getTopics);

app.get("/api/articles", (getAllArticles))

app.get("/api/articles/:article_id", getSoleArticle)

app.get("/api/articles/:article_id/comments", getArticlesComments)

app.use(errorHandlers);

module.exports = app;