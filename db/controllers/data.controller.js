const {topicsModel} = require('../models/data.model.js')

exports.getTopics = (req, res, next) => {
  topicsModel()
    .then((topics) => {
      res.status(200).send(topics)
    })
    .catch(next)
}
