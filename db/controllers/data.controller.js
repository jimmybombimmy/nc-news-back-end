const {
  topicsModel,
  getApiModel,
  getSoleArticleModel,
  getAllArticlesModel
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

exports.getAllArticles = (req, res, next) => {
  getAllArticlesModel()
    .then((articles) => {
      res.status(200).send({articles})
    })
}

exports.getSoleArticle = (req, res, next) => {
  const {article_id} = req.params;
  getSoleArticleModel(article_id)
    .then((article) => {
      res.status(200).send(article)
    })
    .catch(next)
}
