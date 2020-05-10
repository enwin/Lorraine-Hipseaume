const data = require('./entries.json');

const paging = 50;

exports.handler = async function(event, context, callback) {
  const range = event.queryStringParameters.q;
  const page = event.queryStringParameters.page ? event.queryStringParameters.page-1 : 0;

  if( !range ){
    callback(null, {
      statusCode: 403,
      body: ''
    });
  }

  const [start, end] = range.split('-');

  const results = data.filter(entry => entry.annee_naissance >= start && entry.annee_naissance <= end ).sort((a, b) => a.annee_naissance > b.annee_naissance ? 1 : a.annee_naissance < b.annee_naissance ? -1 : 0);

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
