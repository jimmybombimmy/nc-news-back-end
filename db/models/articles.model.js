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


exports.getAllArticlesModel = async(topic, sort_by, order) => {

  const allowableSortArray = ['title', 'topic', 'author', 'created_at', 'votes', 'comment_count']

  let topicQuery = ''
  let orderByQuery = ''
  
  if (/[^A-Za-z]/.test(topic) || order === "error400") {
    return Promise.reject({
      status: 400,
      message: 'Bad Request'
    })
  }
  
  if (order === undefined) { 
    if (sort_by === 'title' || sort_by === 'topic' || sort_by === 'author' || sort_by === 'title') {
      order = 'asc'
    } else {
      order = 'desc';
    }
    
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
        } else {
          topicQuery = `WHERE articles.topic = '${topic}'`
        }
      })

  }

  if (sort_by !== undefined) {
    let badSortCheck = true
    allowableSortArray.map(item => {
      if (item === sort_by) {
        badSortCheck = false
      }
    })
    if (badSortCheck === true) {
      return Promise.reject({
        status: 400,
        message: 'Bad Request'
      })
    } else {
      orderByQuery = `ORDER BY ${sort_by} ${order}`
    }
  } else {
    orderByQuery = `ORDER BY created_at ${order}`
  }

  const sqlQuery = `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, CAST(COUNT(comments.article_id) AS INTEGER) AS comment_count
  FROM articles
  LEFT JOIN comments ON comments.article_id = articles.article_id
  ${topicQuery}
  GROUP BY articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url
  ${orderByQuery}`

  return db.query((sqlQuery))
    .then(({rows}) => {
      return rows
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