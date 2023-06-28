
const {
  topicsModel,
  getApiModel,
  getSoleArticleModel
} = require('../models/data.model.js')


exports.getApiInfo = (req, res, next) => {
  getApiModel()
    .then((apiInfo) => {
      res.status(200).send(apiInfo)
    })
    .catch(next)
}

exports.getTopics = (req, res, next) => {
  topicsModel()
    .then((topics) => {
      res.status(200).send(topics)
    })
    .catch(next)
}

exports.getSoleArticle = (req, res, next) => {
  const {article_id} = req.params;
  getSoleArticleModel(article_id)
    .then((article) => {
      res.status(200).send(article)
    })
    .catch(next)
}