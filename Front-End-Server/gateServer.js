let express = require('express');
let app = express();

//const PORT = process.env.PORT ? process.env.PORT : 9999;
const PORT = process.env.PORT;

  app.use(express.static('public'))

app.listen(PORT, console.log("Listening"));