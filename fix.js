const fs = require( 'fs' ).promises;
const csvStringify = require( 'csv-stringify' );
const data = require( './functions/firstnames.json' );

const ranges = [
  [1891, 1900],
  [1901, 1910],
  [1911, 1920],
  [1921, 1930],
  [1931, 1940],
  [1941, 1950],
  [1951, 1960],
  [1961, 1970],
  [1971, 1980],
  [1981, 1990],
  [1991, 2000],
  [2001, 2010],
  [2011, 2020],
]

const formated = data.map( entry => {
  const formatedEntry = {};

  Object.entries(entry).forEach(([key, value]) => {
    const year = parseInt(key, 10);

    if( isNaN(year) ){
      formatedEntry[key] = value;
      return;
    }

    if( year === 0 ){
      const rangeName = 'xxxx-xxxx';

      if( !formatedEntry[rangeName] ){
        formatedEntry[rangeName] = 0;
      }
      formatedEntry[rangeName] += value;

      return;
    }

    ranges.forEach(([start, end]) => {
      const rangeName = `${start}-${end}`;

      if( year >= start && year <= end  ){
        if( !formatedEntry[rangeName] ){
          formatedEntry[rangeName] = 0;
        }
        formatedEntry[rangeName] += value;
      }
    });
  });

  return formatedEntry;
});

csvStringify(formated, {
  header: true,
  columns: [
    'sexe','prenom_usuel','xxxx-xxxx','1891-1900','1901-1910','1911-1920','1921-1930','1931-1940','1941-1950','1951-1960','1961-1970','1971-1980','1981-1990','1991-2000','2001-2010','2011-2020', 'total'
  ]
}, async (err, data) => {

  await Promise.all([
    fs.writeFile( `${__dirname}/test.csv`, data, 'utf8' ),
    fs.writeFile( `${__dirname}/test.json`, JSON.stringify(formated, null, 2), 'utf8' )
  ]);
})

