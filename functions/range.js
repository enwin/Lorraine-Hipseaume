const lastnames = require('./lastnames.json');
const firstnames = require('./firstnames.json');

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
];

const rarities = {
  lastNames: [500, 100, 50, 1],
  firstNames: [5000, 1000, 500, 1],
};

const filterRandom = (data) => {
  const filtered = [];
  const entriesCount = data.length - 1;

  const pick = () => {
    const entry = data[Math.floor(Math.random() * entriesCount)];

    return entry;
  };

  while (filtered.length < 100) {
    filtered.push(pick());
  }

  return Promise.resolve(filtered);
};

const filterRange = (data, { range, rarity, title }) => {
  const [start, end] = range.split('-');

  const currentRanges = ranges
    .map(([rangeStart, rangeEnd]) => {
      if (start <= rangeEnd && end >= rangeStart) {
        return `${rangeStart}-${rangeEnd}`;
      }
    })
    .filter(Boolean);

  const result = data.filter((entry) => {
    if (title && entry.sexe !== title) {
      return false;
    }

    const matchingRange = currentRanges.some((range) => {
      return entry[range] && entry[range] >= rarity;
    });

    return matchingRange || entry['xxxx-xxxx'] >= rarity;
  });

  return Promise.resolve(result);
};

const filterRangeLastnames = (data, { range, rarity }) => {
  const [start, end] = range.split('-');

  const currentRanges = ranges
    .map(([rangeStart, rangeEnd]) => {
      if (start <= rangeEnd && end >= rangeStart) {
        return `${rangeStart}-${rangeEnd}`;
      }
    })
    .filter(Boolean);

  const result = data.filter((entry) => {
    const matchingRange = currentRanges.some((range) => {
      return entry[range] && entry[range] >= rarity;
    });

    return matchingRange || entry['1991-2000'] >= rarity;
  });

  return Promise.resolve(result);
};

exports.handler = async function (event, context, callback) {
  console.log('EVENT', { event })
  const range = event.queryStringParameters.q;
  const page = event.queryStringParameters.page
    ? event.queryStringParameters.page - 1
    : 0;
  const title = event.queryStringParameters.title
    ? +event.queryStringParameters.title
    : 0;
  const rarityLevel = event.queryStringParameters.rarity
    ? +event.queryStringParameters.rarity
    : 0;

  if (!range) {
    callback(null, {
      statusCode: 403,
      body: '',
    });
  }

  const lastNames = await filterRangeLastnames(lastnames, {
    range,
    rarity: rarities.lastNames[rarityLevel],
  }).then(filterRandom);
  const firstNames = await filterRange(firstnames, {
    range,
    title,
    rarity: rarities.firstNames[rarityLevel],
  }).then(filterRandom);
  const results = firstNames.map(({ sexe, prenom_usuel }, index) => {
    return {
      sexe,
      prenom: prenom_usuel,
      nom: lastNames[index].nom,
    };
  });

  const response = {
    results,
    total: results.length,
  };

  callback(null, {
    statusCode: 200,
    headers: { 'content-type': 'application/json; charset=utf-8' },
    body: JSON.stringify(response, null, 2),
  });
};
