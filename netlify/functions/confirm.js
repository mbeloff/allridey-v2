const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  // 'Access-Control-Allow-Methods': 'GET'
};
exports.handler = async function (event) {
  console.log('confirm payment function event: ' + JSON.stringify(event))
  let response = JSON.stringify(event)
  return {
    statusCode: 200,
    headers,
    body: response
  }
}