const db = require('../connection.js')
const fs = require("fs/promises");
const errors = require('../errors.js');
const { log } = require('console');

exports.getApiModel = () => {
  return fs.readFile(`endpoints.json`, "utf-8")
    .then(endpoints => {
      const parseId = JSON.parse(endpoints);
      return parseId
    })
}


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

exports.getAllArticlesModel = () => {
  return db.query((`
    SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, CAST(COUNT(comments.article_id) AS INTEGER) AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    GROUP BY articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url
    ORDER BY created_at DESC;
  `))
    .then(articles => {
      return articles.rows
    })
}

exports.getSoleArticleModel = (id) => {
  return db.query((`SELECT * FROM articles WHERE article_id = ${id};`))
    .then(article => {
      if (!article.rows[0]) {
        return Promise.reject({
          status: 404,
          message: "Page Not Found",
        });
      }
      return article.rows[0]
    })
}

exports.changeSoleArticleModel = async (id, vote, res) => {

  await db.query((
    `SELECT votes FROM articles WHERE article_id = ${id}`
  )).then(({rows}) => {
    if (rows.length === 0) {
      return Promise.reject({
        status: 400,
        message: 'Bad Request'
      })
    }
      return currentVotes = rows[0].votes + vote
    })
    
  await db.query((
    `UPDATE articles 
    SET votes = ${currentVotes}
    WHERE article_id = ${id};`
  ))

  return db.query((
    `SELECT * FROM articles WHERE article_id = ${id}`
  )).then(({rows}) => {
    return rows
  })

}



