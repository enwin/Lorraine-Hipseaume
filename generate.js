const fs = require( 'fs' ).promises;
const csvParse = require( 'csv-parse' );

(async () => {
  const csvData = await fs.readFile(`${__dirname}/data/nat.csv`, 'utf8');

  const data = await new Promise((resolve, reject) => {
    csvParse(csvData, {
      delimiter: ';',
      columns: true,
      cast(value, context) {
        if(context.header || context.column === 'preusuel'){
          return value.trim();
        }

        return value !== 'XXXX' ? parseInt(value, 10) : undefined;
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

  await fs.writeFile( `${__dirname}/functions/entries.json`, JSON.stringify(data, null, 2), 'utf8' );
})()
