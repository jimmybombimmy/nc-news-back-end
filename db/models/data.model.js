const db = require('../connection.js')
const fs = require("fs/promises");


exports.getApiModel = () => {
  return fs.readFile(`endpoints.json`, "utf-8")
    .then(endpoints => {
      const parseId = JSON.parse(endpoints);
      return parseId
    })
}

exports.topicsModel = () => {
  return db.query('SELECT * FROM topics')
    .then(results => {
      return results.rows
    })
}

exports.getSoleArticleModel = (id) => {
  return db.query((`SELECT * FROM articles WHERE article_id = ${id};`))
    .then(article => {
      if(!article.rows[0]) {
        return Promise.reject({
          status: 404,
          message: "Page Not Found",
        });
      }
      return article.rows[0]
    })
}
