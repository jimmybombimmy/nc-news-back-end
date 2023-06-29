const app = require("./app.js");
const {
  PORT = 9090
} = process.env;

app.listen(PORT, (err) => {
  if (err) console.log("Error running on server");
  else console.log(`Server running on port ${PORT}`);
});