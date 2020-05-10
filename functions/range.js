const data = require('./entries.json');

const paging = 50;

const filterDedupe = (data) => {
  const deduped = data.reduce((acc, entry) => {
    const existingIndex = acc.findIndex(({sex, prenom_usuel}) => sex === entry.sex && prenom_usuel === entry.prenom_usuel );

    if( existingIndex >= 0 ){
      const existingEntry = acc[ existingIndex];

      if( !existingEntry.annee_naissance.includes(entry.annee_naissance) ){
        existingEntry.annee_naissance.push( entry.annee_naissance );
      }

      existingEntry.annee_naissance.sort();

      acc.splice(existingIndex, 1, {
        ...existingEntry,
        nombre: existingEntry.nombre + entry.nombre,
        annee_naissance: existingEntry.annee_naissance,
      });
    }
    else {
      acc.push( {
        ...entry,
        annee_naissance: [entry.annee_naissance]
      } );
    }
    return acc;
  }, []);

  return Promise.resolve(deduped);
};

const filterRandom = (data) => {
  const filtered = [];

  const pick = () => {
    const entriesCount = data.length - 1;
    const entry = data.splice(Math.floor(Math.random() * entriesCount), 1);

    return entry;
  }

  while (filtered.length < 50 && data.length){
    filtered.push(pick());
  }


  return Promise.resolve(filtered);

};

const filterRange = (data, range) => {
  const [start, end] = range.split('-');

  return Promise.resolve( data.filter(entry => entry.annee_naissance >= start && entry.annee_naissance <= end ) );
}


exports.handler = async function(event, context, callback) {
  const range = event.queryStringParameters.q;
  const page = event.queryStringParameters.page ? event.queryStringParameters.page-1 : 0;

  if( !range ){
    callback(null, {
      statusCode: 403,
      body: ''
    });
  }

  const results = await filterRange( data, range )
    .then(filterDedupe)
    .then(filterRandom);

  const response = {
    results,
    total: results.length
  }

  callback(null, {
    statusCode: 200,
    body: JSON.stringify(response, null, 2),
  });
}
