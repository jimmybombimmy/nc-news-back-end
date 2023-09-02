const express = require("express");
const cors = require('cors');

const {
  getTopics,
  getApiInfo,
  getSoleArticle,
  getAllArticles,
  changeArticleVotes
} = require("./db/controllers/articles.controller.js")
const {
  getArticlesComments,
  postArticleComment,
  deleteComment
} = require("./db/controllers/comments.controller.js")
const {
  getAllUsers
} = require("./db/controllers/users.controller.js")


const {errorHandlers} = require("./db/errors.js")

const app = express();

app.use(express.json())

app.use(cors());

app.get("/api", getApiInfo)

app.get("/api/topics", getTopics);

app.get("/api/articles", (getAllArticles))

app.get("/api/articles/:article_id", getSoleArticle)

app.get("/api/articles/:article_id/comments", getArticlesComments)

app.get("/api/users", getAllUsers)

app.post("/api/articles/:article_id/comments", postArticleComment)

app.patch("/api/articles/:article_id", changeArticleVotes)

app.delete("/api/comments/:comment_id", deleteComment)

app.delete("")

app.use(errorHandlers);

app.listen(9090, (err) => {
  if (err) console.log("Error running on server");
  else console.log(`Server running on port 9090`);
});

module.exports = app;