import ui from './script/ui.js';
import inputOptions from './script/input-options.js';

inputOptions();

const rangeEndpoint = '/.netlify/functions/range';

class Names {
  constructor() {
    this.refs = {
      form: document.querySelector('form'),
      list: document.querySelector('ul.list'),
      decade: document.getElementById('decade-display'),
      decadeTitle: document.querySelector('.input-option.decade p'),
    };

    this.data = {
      results: [],
      decadeValues: JSON.parse(this.refs.decadeTitle.dataset.values),
    };

    this.bind();
  }

  bind() {
    this.refs.form.addEventListener('submit', (event) => {
      event.preventDefault();
      this.submitForm(event);
    });

    this.refs.form.addEventListener('input', (event) => {
      if (event.target.name === 'title') {
        this.updateDecadeTitle();
      }
    });

    document.addEventListener('click', (event) => {
      const action = event.target.closest('[data-action]');

      if (action) {
        this.handleAction(action);
      }
    });
  }

  async copyList() {
    const items = Array.from(this.refs.list.querySelectorAll('output'));

    const names = items.map((item) => item.textContent.trim());

    await navigator.clipboard.writeText(names.join('\n'));
  }

  displayResults() {
    const listItems = this.results.map(({ prenom, nom }, index) => {
      return `<li><output form="list-names">${prenom} ${nom}</output></li>`;
    });

    this.refs.list.innerHTML = listItems.join('\n');
  }

  handleAction(el) {
    const actionName = el.dataset.action;

    if (actionName === 'copy' && navigator.clipboard) {
      this.copyList();
    }
  }

  updateDecadeTitle() {
    this.refs.decadeTitle.textContent = this.data.decadeValues[
      +this.refs.form.elements['title'].value
    ];
  }

  async submitForm() {
    const data = new FormData(this.refs.form);

    const searchParams = new URLSearchParams();

    for (const [name, value] of data.entries()) {
      searchParams.set(name, value);
    }

    const queryString = searchParams.toString();

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

  get results() {
    return this.data.results;
  }

  set results(value) {
    this.data.results = value;
    this.displayResults();
  }
}

new Names();
