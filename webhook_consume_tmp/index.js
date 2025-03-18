// Require express and body-parser
const express = require("express")
const bodyParser = require("body-parser")
const path = require("path")

// Initialize express and define a port
const app = express()
const PORT = 3000

// Tell express to use body-parser's JSON parsing
app.use(bodyParser.json())

//Routes
const webhook = require("./webhook.js")
app.use('/webhook', webhook)
app.use('/images', express.static(path.join(__dirname, 'images')))


//Default
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
});

const ws = require("./ws.js");

// Start express on the defined port
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))
