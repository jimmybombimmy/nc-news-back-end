const express = require("express");
const {
  getTopics,
  getApiInfo,
  getSoleArticle,
  getAllArticles,
  getArticlesComments,
  postArticleComment
} = require("./db/controllers/data.controller.js")
const {errorHandlers} = require("./db/errors.js")

const app = express();

app.use(express.json())

app.get("/api", getApiInfo)

app.get("/api/topics", getTopics);

app.get("/api/articles", (getAllArticles))

app.get("/api/articles/:article_id", getSoleArticle)

app.get("/api/articles/:article_id/comments", getArticlesComments)

app.post("/api/articles/:article_id/comments", postArticleComment)

app.use(errorHandlers);

module.exports = app;