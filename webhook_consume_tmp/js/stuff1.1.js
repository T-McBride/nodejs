const { faker } = require ('@faker-js/faker')
const https = require('https');
const http = require("http");

exports.ICEgetPipeline = async () => {
  const options = {
    method: 'POST',
    hostname: 'api.elliemae.com',
    port: null,
    path: '/encompass/v3/loanPipeline?ignoreInvalidFields=false',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json'
    }
  };
  var data = '{"GUID":"abc123"}'
  var fdata = ""
  const req = https
    .request(options, res => {
      let data = ''
      this.WSNotify('{"message":"subprocess ICE getPipeline","action": "Response code: ' + res.statusCode + '","loanData":"n/a"}')
      res.on('data', chunk => {
        data += chunk
      })
      res.on('end', () => {
        return(data)
      })
    })
    .on('error', err => {
      return(err.message)
    })
  req.write(data)
  req.end()
}


exports.WSNotify = (data) => {
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
      res.on('data', chunk => {
        data += chunk
      })
      res.on('end', () => {
        //console.log('Body: ', data)
      })
    })
    .on('error', err => {
      console.log('stuff.WSNotify Error: ', err.message)
    })
  req.write(data)
  req.end()
}

exports.getFakeEvent = () => {
    const fData = '{"message":"subprocess fake event created", "action": "Fake event created: ' + faker.helpers.arrayElement(['Order Flood', 'Order Fraud', 'UDM on', 'Smart Fees','Credit','Appraisal Ordered']) + '"' + 
    ', "loanData": "{GUID: ' + faker.string.uuid() + 
    ', OrderNumber: ' + faker.string.ulid() + '}' +
    '"}'
    return(fData)
}

exports.getFakeData = () => {
     const fData = '{"message":"subprocess fake data created", "action": "Fake data created"' + 
      ', "loanData" : "{GUID: ' + faker.string.uuid() + ', LoanNum: ' + faker.helpers.arrayElement(['000','142','141', '214']) + '25' + faker.helpers.replaceSymbols('####') + 
      ', Name: ' + faker.person.fullName() + 
      ', Address: ' + faker.location.streetAddress() + ' ' + faker.location.city() + ' ' + faker.location.state({abbreviated: true}) + ' ' + faker.location.zipCode() + 
      ', AccountName: ' + faker.finance.accountName() + ' ' + faker.finance.accountNumber() + ' ' + faker.finance.amount() + '}"' +
      '}'
    return(fData)
}
