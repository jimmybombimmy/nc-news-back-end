const db = require('../connection.js')

exports.getArticlesCommentsModel = (id) => {

  let err404 = false

  db.query(`SELECT * FROM articles`)
    .then((comments) => {
      return comments.rows.filter((row) => {
        return row.article_id === Number(id)
      })
    }).then((commentsFilter) => {
      const idNumberCheck = /(^\d+$)/.test(id)
      if (commentsFilter.length === 0 && idNumberCheck === true) {
        return err404 = true
      }
    })

  return db.query((`SELECT * FROM comments WHERE article_id = ${id} ORDER BY created_at DESC;`))
    .then((comments) => {
      if (err404 === true) {
        return Promise.reject({
          status: 404,
          message: 'Page Not Found'
        })
      }
      return comments.rows
    })
}

//to do: get the 404 check from above and replace the id being 1-13 with that better check

exports.postArticleCommentModel = async (id, {
  body,
  author
}) => {
  id = parseInt(id)

  let err404;

  const comments = await db.query(`SELECT * FROM articles`)

  const commentsFilter = comments.rows.filter((row) => {
    return row.article_id === Number(id);
  });

  const idNumberCheck = /(^\d+$)/.test(id)

  if (commentsFilter.length === 0 && idNumberCheck === true) {
    err404 = true;
  } else {
    err404 = false;
  }

  if (err404 === true) {
    return Promise.reject({
      status: 404,
      message: "Page Not Found",
    });
  } else if (isNaN(id) === true || body == undefined) {
    return Promise.reject({
      status: 400,
      message: 'Bad Request'
    });
  } else {
    return db.query(`
      INSERT INTO comments
      (body, author, article_id)
      VALUES
      ($1, $2, $3)
      RETURNING *;`, [body, author, id]).then(comment => {
      return comment.rows[0];
    })
  }
}

exports.deleteCommentModel = async (id) => {

  const idNumberCheck = /(^\d+$)/.test(id)
  const commentCheck = await db.query(`SELECT * FROM comments WHERE comment_id = ${id}`)

  if (idNumberCheck === false) {
    return Promise.reject({
      status: 400,
      message: 'Bad request'
    })
  } else if (commentCheck.rows.length === 0) {
    return Promise.reject({
      status: 404,
      message: "Page not found"
    })
  }

  return db.query((`DELETE FROM comments WHERE comment_id = ${id}`))
}