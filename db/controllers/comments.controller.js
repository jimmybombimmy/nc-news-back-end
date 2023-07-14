const {
  getArticlesCommentsModel,
  postArticleCommentModel
} = require("../models/comments.model")


exports.getArticlesComments = (req, res, next) => {
  const {
    article_id
  } = req.params;
  // console.log("req.params:", req.params)
  getArticlesCommentsModel(article_id)
    .then((comments) => {
      res.status(200).send({
        comments
      })
    })
    .catch(next)
}

exports.postArticleComment = (req, res, next) => {
  const {
    article_id
  } = req.params;
  const newComment = req.body
  // console.log("newComment", Object.keys(newComment))
  postArticleCommentModel(article_id, newComment)
    .then((comment) => {
      res.status(201).send(comment)
    })
    .catch(next)
}