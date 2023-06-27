const db = require('../connection.js')
const fs = require("fs/promises");
const {getTopics} = require('../queries/queries.js')

exports.getApiModel = () => {
  return fs.readFile(`endpoints.json`, "utf-8")
    .then(endpoints => {
      const parseId = JSON.parse(endpoints);
      return parseId
    })
}

exports.topicsModel = () => {
  return db.query(getTopics)
    .then(results => {
      return results.rows
    })
}