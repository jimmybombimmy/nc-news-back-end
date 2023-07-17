const {
  getArticlesCommentsModel,
  postArticleCommentModel,
  deleteCommentModel
} = require("../models/comments.model")


exports.getArticlesComments = (req, res, next) => {
  const {
    article_id
  } = req.params;
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
  postArticleCommentModel(article_id, newComment)
    .then((comment) => {
      res.status(201).send(comment)
    })
    .catch(next)
}

exports.deleteComment = (req, res, next) => {
  const {comment_id} = req.params
  deleteCommentModel(comment_id)
    .then(() => {
      res.status(204).send({
        message: "Page Deleted"
      })
    })
    .catch(next)
}