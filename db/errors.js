exports.errorHandlers = (err, req, res, next) => {
  // Custom errors
  if (err.status && err.message) {
    res.status(err.status).send({
      message: err.message
    });
  }
  // psql 400 errors
  else if (err.code === '22P02' || err.code === '42703') {
    res.status(400).send({
      message: 'Bad Request'
    });
  } 
  // internal server error (for if error unidentified)
  else {
    res.status(500).send({
      msg: 'Internal Server Error'
    });
  }
}