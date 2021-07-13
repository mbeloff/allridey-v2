const fetch = require("node-fetch");

const headers = {
  'Access-Control-Allow-Origin': 'http://localhost:3000',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST'
};

exports.handler = async function (event) {
  // console.log(event)
  // let msg = event.body
  var pxpayuser = process.env.PXPAY_USER
  var pxpaykey = process.env.PXPAY_KEY
  var amount = '1.00'
  var currency = 'AUD'
  var successURL = 'http://localhost:3000/pay/success'
  var failURL = 'http://localhost:3000/pay/fail'
  // var body = event;

  var raw = "<GenerateRequest>\r\n<PxPayUserId>" + pxpayuser + "</PxPayUserId>\r\n<PxPayKey>" + pxpaykey + "</PxPayKey>\r\n<TxnType>Purchase</TxnType>\r\n<AmountInput>" + amount + "</AmountInput>\r\n<CurrencyInput>" + currency + "</CurrencyInput>\r\n<UrlSuccess>" + successURL + "</UrlSuccess>\r\n<UrlFail>" + failURL + "</UrlFail>\r\n<UrlCallback>https://InsertValidUrlForCallback</UrlCallback>\r\n</GenerateRequest>";

  var requestOptions = {
    method: 'POST',
    headers: {"Content-Type": "application/xml"},
    body: raw,
    redirect: 'follow'
  };

  const response = await fetch("https://sec.windcave.com/pxaccess/pxpay.aspx", requestOptions)
  .then(response => response.text())
  .catch(error => console.log('error', error));
  console.log(response)

  return {
    statusCode: 200,
    headers,
    body: response
  }
}