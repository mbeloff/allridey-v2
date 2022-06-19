const crypto = require('crypto');
const headers = {
  'Access-Control-Allow-Origin': process.env.VITE_HOST,
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST',
}
exports.handler = async function (event) {
  var secret = process.env.RCM_SECRET
  let msg = event.body
  var hashInHex = crypto.createHmac('sha256', secret).update(msg).digest('hex')

  let signature = '{"signature":"' + hashInHex + '"}'

  return {
    statusCode: 200,
    headers,
    body: signature,
  }
}
