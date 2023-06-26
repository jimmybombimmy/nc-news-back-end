
const pool = require('../connection.js')
const queries = require('../queries/queries.js')

exports.topicsRoute = (req, res) => {
  pool.query(queries.getTopics, (err, results) => {
    if (err) throw err;
    res.status(200).json(results.rows)
  })
  
}