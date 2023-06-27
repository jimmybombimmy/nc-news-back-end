const db = require('../connection.js')
const {getTopics} = require('../queries/queries.js')

exports.topicsModel = () => {
  return db.query(getTopics)
    .then(results => {
      return results.rows
    })
}