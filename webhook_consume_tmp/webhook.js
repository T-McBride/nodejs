const express = require('express')
const router = express.Router()
const stuff = require ('./stuff1.0.js');
const { check, query, validationResult } = require('express-validator')

router.get('/', (req, res, next) => {
  var payload = JSON.stringify(req.query)
  payload = payload + JSON.stringify(req.body)
  res.send(payload)
});

router.post('/fdata', [
  check('message', 'Message cannot be empty').notEmpty(),
  check('message', 'Message must be 8 chars long').isLength({min:8})
  ], (req, res, next) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.mapped());
    console.log("errors")
    return res.status(200).json({ message: "Errors!" })
  }else{
    stuff.ICEgetPipeline()
    postHTTP(stuff.getFakeData())
    return res.status(200).json({ message: "Success" })
  }
});

router.post('/fevent', [
  check('message', 'Message cannot be empty').notEmpty(),
  check('message', 'Message must be 8 chars long').isLength({min:5})
  ], (req, res, next) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.mapped());
    console.log("errors")
    return res.status(200).json({ message: "Errors!" })
  }else{
    postHTTP(stuff.getFakeEvent())
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
      console.log('WS Notify Status Code:', res.statusCode)
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
