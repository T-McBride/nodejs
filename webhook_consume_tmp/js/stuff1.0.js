const { faker } = require ('@faker-js/faker')
const https = require('https');
const http = require("http");

exports.ICEgetPipeline = () => {
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
  const req = https
    .request(options, res => {
      let data = ''
      console.log('ICE loanPipeline Status Code:', res.statusCode)
      res.on('data', chunk => {
        data += chunk
      })
      res.on('end', () => {
        //console.log('Body: ', data)
      })
    })
    .on('error', err => {
      console.log('Error: ', err.message)
    })
  req.write(data)
  req.end()
  //console.log(JSON.stringify(req));
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



exports.getFakeEvent = () => {
    const fData = '{"message":"GUID:' + faker.string.uuid() + 
    ', \\r\\n Loan Num:' + faker.helpers.arrayElement(['000','142','141', '214']) + '25' + faker.helpers.replaceSymbols('####') + 
    ', \\r\\n Action: ' + faker.helpers.arrayElement(['Order Flood', 'Order Fraud', 'UDM on', 'Smart Fees','Credit']) + 
    '"}'
    return(fData)
}

exports.getFakeData = () => {
    const fData = '{"message":"GUID:' + faker.string.uuid() +
    ', Loan Num: ' + faker.helpers.arrayElement(['000','142','141', '214']) + '25' + faker.helpers.replaceSymbols('####') + 
    ', Type: ' + faker.helpers.arrayElement(['Conventional', 'FHA', 'VA', 'USDA']) + 
    ', Action: ' + faker.helpers.arrayElement(['Started', 'Processing', 'Submitted', 'Resubmitted','Cleared to Close', 'Locked']) + 
    ', Borrower: ' + faker.person.fullName() + 
    ', Address:  ' + faker.location.streetAddress() + ' ' + faker.location.city() + ' ' + faker.location.state({abbreviated: true}) + ' ' + faker.location.zipCode() +  
    '"}'
    return(fData)
}
