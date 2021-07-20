const CryptoJS = require('crypto-js/crypto-js')
const headers = {
  'Access-Control-Allow-Origin': 'http://localhost:3000',
  // 'Access-Control-Allow-Origin': 'https://dev.allridey.com.au/',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST'
};
exports.handler = async function (event) {
  var secret = process.env.RCM_SECRET;
  console.log(event)
  let msg = event.body
  var hash = CryptoJS.HmacSHA256(msg, secret);
  var hashInHex = CryptoJS.enc.Hex.stringify(hash);
  console.log(hashInHex);

  let signature = '{"signature":"' + hashInHex + '"}'

  return {
    statusCode: 200,
    headers,
    body: signature
  }
}