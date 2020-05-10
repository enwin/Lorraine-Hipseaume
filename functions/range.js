const data = require('./entries.json');

const paging = 50;

exports.handler = async function(event, context, callback) {
  const range = event.queryStringParameters.q;
  const page = event.queryStringParameters.page ? event.queryStringParameters.page-1 : 0;

  if( range === undefined ){
    callback(null, {
      statusCode: 403,
      body: ''
    });
  }

  let [start, end] = range.split('-');

  // query names with no annais
  if( start === '' && !end ){
    start = undefined;
  }

  const results = data.filter(entry => (entry.annais >= start && entry.annais <= end) || entry.annais === start ).sort((a, b) => a.annais > b.annais ? 1 : a.annais < b.annais ? -1 : 0);

  const response = {
    results: results.slice(paging * page, (paging * page) + paging),
    total: results.length,
    nextPage: page+2,
  }

  if( page ){
    response.lastPage = page;
  }

  callback(null, {
    statusCode: 200,
    body: JSON.stringify(response, null, 2),
  });
}
