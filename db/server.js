const app = require("../app.js");

function serverInfo(app) {
  app.listen(9090, (err) => {
      if (err) console.log("Error running on server");
      else console.log(`Server running on port 9090`);
    });
}

module.exports = serverInfo