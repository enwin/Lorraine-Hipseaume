const fs = require( 'fs' ).promises;
const csvParse = require( 'csv-parse' );

const generateNames = (names) => {
  return names.map(async (name) => {
    const csvData = await fs.readFile(`${__dirname}/data/${name}.csv`, 'utf8');

    const data = await new Promise((resolve, reject) => {
      csvParse(csvData, {
        columns: true,
        cast(value, context) {
          const formatedValue = parseInt(value, 10);

          if( context.header || isNaN(formatedValue) ){
            return value.trim();
          }

          return formatedValue;
        }
      }, (err, data) => {
        if( err ){
          reject(err);
          return;
        }

        resolve(data);
      })
    })
    .catch(() => ([]));

    return fs.writeFile( `${__dirname}/functions/${name}.json`, JSON.stringify(data, null, 2), 'utf8' );
  });
}

generateNames(['firstnames', 'lastnames']);
