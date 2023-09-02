const {
  getAllUsersModel
} = require('../models/users.model.js')

exports.getAllUsers = (req, res, next) => {
  getAllUsersModel()
    .then((users) => {
      res.status(200).send(users)
    })
    .catch(next)
}