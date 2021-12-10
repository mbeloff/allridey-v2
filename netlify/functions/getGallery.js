
const cloudinary = require('cloudinary')
const headers = {
  'Access-Control-Allow-Origin': process.env.VITE_HOST,
  'Access-Control-Allow-Headers': 'Content-Type',
  // 'Access-Control-Allow-Methods': 'GET'
};
exports.handler = async function (event) {
  let catid = JSON.parse(event.body).catid
  let expression = 'folder=vehicles/' + catid

  cloudinary.config({ 
    cloud_name: process.env.VITE_CLOUD_NAME, 
    api_key: process.env.VITE_CLOUD_KEY, 
    api_secret: process.env.VITE_CLOUD_SECRET,
    secure: true 
  });
  let list = []
  await cloudinary.v2.search.expression(expression)
  .sort_by('public_id').max_results(10).execute().then(result => result.resources.forEach(el => list.push(el.public_id) + '.jpg'))
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(list)
  }
}