const CryptoJS = require('crypto-js/crypto-js')

exports.handler = async function (event) {
        var secret = process.env.RCM_SECRET;
        // var body = event;
        let msg='{"method":"step1"}'
        var hash = CryptoJS.HmacSHA256(msg, secret);
        var hashInHex = CryptoJS.enc.Hex.stringify(hash);
        console.log(hashInHex);

        let signature = '{"signature":' + hashInHex + '}'

        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(signature)
        }
}