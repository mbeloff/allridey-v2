const CryptoJS = require('crypto-js/crypto-js')
const headers = {
  'Access-Control-Allow-Origin': process.env.VITE_HOST,
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST'
};
exports.handler = async function (event) {
  var secret = process.env.RCM_SECRET;
  let msg = event.body
  var hash = CryptoJS.HmacSHA256(msg, secret);
  var hashInHex = CryptoJS.enc.Hex.stringify(hash);

  let signature = '{"signature":"' + hashInHex + '"}'

  return {
    statusCode: 200,
    headers,
    body: signature
  }
}