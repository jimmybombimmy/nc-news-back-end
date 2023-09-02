const db = require('../connection.js')

exports.getAllUsersModel = () => {
  return db.query(`SELECT * FROM users;`)
    .then(({rows}) => {
      console.log(rows)
      return rows
    })
}