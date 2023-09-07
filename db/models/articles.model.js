const db = require('../connection.js')
const fs = require("fs/promises");
const errors = require('../errors.js');
const {
  log
} = require('console');

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


exports.getAllArticlesModel = async(topic, order) => {
  
  if (/[^A-Za-z]/.test(topic)) {
    return Promise.reject({
      status: 400,
      message: 'Bad Request'
    })
  }
  
  if (order === undefined) { 
    order = 'desc';
  }
  if (topic !== undefined) {
    let badTopicCheck = true
    await db.query((`SELECT slug FROM topics`))
      .then(({
        rows
      }) => {
        rows.map(row => {
          if (row.slug === topic) {
            badTopicCheck = false
          }
        })
      })
      .then(() => {
        if (badTopicCheck === true) {
          return Promise.reject({
            status: 404,
            message: 'Page Not Found'
          })
        }
      })
    

    return db.query((`
    SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, CAST(COUNT(comments.article_id) AS INTEGER) AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    WHERE articles.topic = '${topic}'
    GROUP BY articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url
    ORDER BY created_at ${order};
  `))
      .then(articles => {
        return articles.rows
      })
  }
  return db.query((`
    SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, CAST(COUNT(comments.article_id) AS INTEGER) AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    GROUP BY articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url
    ORDER BY created_at ${order};
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
  )).then(({
    rows
  }) => {
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
  )).then(({
    rows
  }) => {
    return rows
  })

}