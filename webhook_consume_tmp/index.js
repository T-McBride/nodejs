// Require express and body-parser
const express = require("express")
const bodyParser = require("body-parser")
const path = require("path")
const router = require("./router.js")
const ws = require("./js/ws.js");

// Initialize express and define a port
const app = express()
const PORT = 3000

app.use(bodyParser.json())
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use('/js', express.static(path.join(__dirname, 'js')))
app.use('/pages', express.static(path.join(__dirname, 'pages')))
app.use('/css', express.static(path.join(__dirname, 'css')))
app.use('/', router);

// Start express on the defined port
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))
