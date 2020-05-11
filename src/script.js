const rangeEndpoint = '/.netlify/functions/range';

class Names {
  constructor() {
    this.refs = {
      form: document.querySelector('form'),
      range: document.querySelector('input[type="range"]'),
      list: document.querySelector('ul'),
      decade: document.getElementById('decade-display'),
    };

    this.data = {
      range: this.refs.decade.textContent,
      results: [],
    };

    this.ranges = [
      '1891-1900',
      '1901-1910',
      '1911-1920',
      '1921-1930',
      '1931-1940',
      '1941-1950',
      '1951-1960',
      '1961-1970',
      '1971-1980',
      '1981-1990',
      '1991-2000',
      '2001-2010',
      '2011-2020',
    ];

    this.bind();
  }

  bind() {
    this.refs.form.addEventListener('submit', (event) => {
      event.preventDefault();
      this.submitForm(event);
    });
    this.refs.range.addEventListener('input', (event) => {
      window.clearTimeout(this.fetchTimeout);

      this.fetchTimeout = window.setTimeout(() => {
        this.submitForm(event);
      }, 300);
    });
  }

  displayResults() {
    const listItems = this.results.map(({ prenom, nom }) => {
      return `<li><output for="decade" form="list-names">${prenom} ${nom}</output></li>`;
    });

    this.refs.list.innerHTML = listItems.join('\n');
  }

  async submitForm() {
    const data = new FormData(this.refs.form);

    this.range = this.ranges[+data.get('q')];

    data.set('q', this.range);

    const queryString = new URLSearchParams(data).toString();

    const endpoint = `${rangeEndpoint}?${queryString}`;

    const { results } = await window
      .fetch(endpoint)
      .then((res) => res.json())
      .catch(() => ({ error: true }));

    if (!results) {
      return;
    }

    this.results = results;
  }

  get range() {
    return this.data.range;
  }

  set range(value) {
    this.data.range = value;
    this.refs.decade.textContent = value;
  }

  get results() {
    return this.data.results;
  }

  set results(value) {
    this.data.results = value;
    this.displayResults();
  }
}

new Names();
