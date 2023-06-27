const {topicsModel, getApiModel} = require('../models/data.model.js')

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
