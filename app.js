const express = require("express");
const {
  getTopics,
  getApiInfo,
  getSoleArticle,
  getAllArticles,
  changeArticleVotes
} = require("./db/controllers/articles.controller.js")
const {
  getArticlesComments,
  postArticleComment
} = require("./db/controllers/comments.controller.js")

const {errorHandlers} = require("./db/errors.js")

const app = express();

app.use(express.json())

app.get("/api", getApiInfo)

app.get("/api/topics", getTopics);

app.get("/api/articles", (getAllArticles))

app.get("/api/articles/:article_id", getSoleArticle)

app.get("/api/articles/:article_id/comments", getArticlesComments)

app.post("/api/articles/:article_id/comments", postArticleComment)

app.patch("/api/articles/:article_id", changeArticleVotes)

app.use(errorHandlers);



app.listen(9090, (err) => {
  if (err) console.log("Error running on server");
  else console.log(`Server running on port 9090`);
});

module.exports = app;