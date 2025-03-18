const express = require('express')
const router = express.Router()

const { check, query, validationResult } = require('express-validator')

/* GET users listing. */
router.get('/', (req, res, next) => {
  var payload = JSON.stringify(req.query)
  payload = payload + JSON.stringify(req.body)
  res.send(payload)
});

router.post('/', [
  check('message', 'Message cannot be empty').notEmpty(),
  check('message', 'Message must be 8 chars long').isLength({min:5})
  ], (req, res, next) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.mapped());
    console.log("errors")
    return res.status(200).json({ message: "Errors!" })
  }else{
    //publish the webhook somewhere 
    postHTTP(JSON.stringify(req.body))
    console.log('no errors')
    return res.status(200).json({ message: "Success" })
  }
});

const http = require("http");

function postHTTP(data) {

  const options = {
    hostname: 'localhost',
    port: '8088',
    path: '/notify',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  }
  
  const req = http
    .request(options, res => {
      let data = ''
      console.log('Status Code:', res.statusCode)
      res.on('data', chunk => {
        data += chunk
      })
      res.on('end', () => {
        console.log('Body: ', data)
      })
    })
    .on('error', err => {
      console.log('Error: ', err.message)
    })
  req.write(data)
  req.end()
}

module.exports = router;
