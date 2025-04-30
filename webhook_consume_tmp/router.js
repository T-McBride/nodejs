const express = require('express')
const router = express.Router();
exports.router = router;
const path = require("path") 
const stuff = require ('./js/stuff1.0.js');
const { check, query, validationResult } = require('express-validator')


//Main
router.get('/', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, '/pages/index.html'));
});
router.get('/nav', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, '/pages/nav.html'));
});
router.get('/about', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, '/pages/about.html'));
});
router.get('/demo', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, '/pages/demo.html'));
});
router.get('/vegas', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, '/pages/vegas.html'));
});


router.post('/fdata', [
  check('message', 'Message cannot be empty').notEmpty(),
  check('message', 'Message must be 8 chars long').isLength({ min: 8 })
], (req, res, next) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.mapped());
    console.log("errors");
    return res.status(200).json({ message: "Errors!" });
  } else {
    postHTTP('{"message":"fdata webhook triggered","action":"Handoff","loanData":"n/a"}');
    //Call to Ice 
    const request = stuff.ICEgetPipeline().then((response) => {
      console.log(response);
      //return response.json()
    }).then((data) => {
      console.log(data);
    }).catch((err) => {
      console.log(err);
    });
    postHTTP(stuff.getFakeData());
    return res.status(200).json({ message: "Success" });
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
    postHTTP('{"message":"fevent webhook triggered","action":"Handoff","loanData":"n/a"}')
    postHTTP(stuff.getFakeEvent())
    return res.status(200).json({ message: "Success" })
  }
});

//Post to websocket; pass JSON
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
      //console.log('WS Notify Status Code:', res.statusCode)
      res.on('data', chunk => {
        data += chunk
      })
      res.on('end', () => {
        //console.log('Body: ', data)
      })
    })
    .on('error', err => {
      //console.log('Error: ', err.message)
    })
  req.write(data)
  req.end()
}
exports.postHTTP = postHTTP;

module.exports = router;
