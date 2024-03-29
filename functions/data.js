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

exports.handler = async function (req, res, next) {
  const range = req.query.q;
  const title = req.query.title ? +req.query.title : 0;
  const rarityLevel = req.query.rarity ? +req.query.rarity : 0;

  if (!range) {
    res.status(403).send();
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

  res.setHeader('content-type', 'application/json; charset=utf-8')
  res.json(response);

  // return {
  //   statusCode: 200,
  //   headers: {
  //     'content-type': 'application/json; charset=utf-8',
  //     'cache-control': `public, max-age=5`
  //   },
  //   body: JSON.stringify(response, null, 2),
  // };
};
