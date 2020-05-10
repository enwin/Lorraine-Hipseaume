const data = require('../data/entries.json');

exports.handler = async function(event, context, callback) {
  const range = event.queryStringParameters.q;

  if( !range ){
    callback(null, {
      statusCode: 403,
      body: ''
    });
  }

  const [start, end] = range.split('-');

  const results = data.filter(entry => entry.annais >= start && entry.annais <= end).sort((a, b) => a.annais > b.annais ? 1 : a.annais < b.annais ? -1 : 0);

  callback(null, {
    statusCode: 200,
    body: JSON.stringify(results, null, 2),
  });
}
