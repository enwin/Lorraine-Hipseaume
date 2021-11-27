import ui from './script/ui.js';
import inputOptions from './script/input-options.js';

inputOptions();

const rangeEndpoint = '/data';

class Names {
  constructor() {
    this.refs = {
      form: document.getElementById('list-names'),
      filter: document.getElementById('filter'),
      list: document.querySelector('ul.list'),
      decade: document.getElementById('decade-display'),
      decadeTitle: document.querySelector('.input-option.decade p'),
      submits: Array.from(document.querySelectorAll('button[type="submit"]')),
    };

    this.data = {
      decadeValues: JSON.parse(this.refs.decadeTitle.dataset.values),
      defaultRefreshText: this.refs.submits[0].textContent,
      loading: false,
      results: [],
      sortedResults: [],
      random: true,
      nameFirst: false,
    };

    this.bind();
    this.submitForm();
  }

  applyFilter(input) {
    if (input.name === 'sort') {
      this.random = !input.checked;

      return;
    }

    if (input.name === 'order') {
      this.nameFirst = input.checked;

      this.sortedResults = this.sortList(this.results);

      const label = input.nextElementSibling;

      const text = label.textContent.split(' — ');

      label.textContent = text.reverse().join(' — ');

      return;
    }
  }

  bind() {
    this.refs.form.addEventListener('submit', (event) => {
      event.preventDefault();
      this.submitForm();
    });

    this.refs.form.addEventListener(
      'change',
      (event) => {
        this.toggleRefreshText();
      },
      true,
    );

    this.refs.form.addEventListener('input', (event) => {
      if (event.target.name === 'title') {
        this.updateDecadeTitle();
      }
    });

    this.refs.filter.addEventListener('input', (event) => {
      this.applyFilter(event.target);
    });

    this.refs.submits[0].addEventListener('animationiteration', (event) => {
      this.watchLoadingAnimation(event);
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
    const list = this.random ? this.results : this.sortedResults;

    const listItems = list.map(({ prenom, nom }) => {
      const name = this.nameFirst ? `${nom} ${prenom}` : `${prenom} ${nom}`;
      return `<li><output form="list-names">${name}</output></li>`;
    });

    this.refs.list.innerHTML = listItems.join('\n');
  }

  fetch(endpoint) {
    const loader = new Promise((resolve) => {
      window.setTimeout(() => {
        resolve();
      }, 750);
    });

    const fetch = window.fetch(endpoint).then((res) => res.json());

    return Promise.all([loader, fetch])
      .then(([, response]) => response)
      .catch(() => ({ error: true }));
  }

  handleAction(el) {
    const actionName = el.dataset.action;

    if (actionName === 'copy' && navigator.clipboard) {
      this.copyList();
      return;
    }
  }

  sortList(list = this.results) {
    return list.slice().sort((a, b) => {
      const nameA = this.nameFirst
        ? `${a.nom} ${a.prenom}`
        : `${a.prenom} ${a.nom}`;
      const nameB = this.nameFirst
        ? `${b.nom} ${b.prenom}`
        : `${b.prenom} ${b.nom}`;

      return nameA.localeCompare(nameB);
    });
  }

  toggleRefreshText(update = true) {
    this.refs.submits.forEach((el) => {
      if (!this.loading && update) {
        el.textContent = `${this.data.defaultRefreshText} !`;
      } else {
        el.textContent = this.data.defaultRefreshText;
      }
    });
  }

  updateDecadeTitle() {
    this.refs.decadeTitle.textContent = this.data.decadeValues[
      +this.refs.form.elements['title'].value
    ];
  }

  watchLoadingAnimation() {
    this.refs.submits.forEach((el) => {
      el.classList.remove('loading');
    });
  }

  async submitForm() {
    if (this.loading) {
      return;
    }

    this.loading = true;

    this.toggleRefreshText(false);

    const data = new FormData(this.refs.form);
    const searchParams = new URLSearchParams();

    for (const [name, value] of data.entries()) {
      searchParams.set(name, value);
    }

    const queryString = searchParams.toString();

    const endpoint = `${rangeEndpoint}?${queryString}`;

    const { results } = await this.fetch(endpoint);

    this.loading = false;

    if (!results) {
      return;
    }

    this.results = results;
  }

  get loading() {
    return this.data.loading;
  }

  set loading(value) {
    this.refs.list.setAttribute('aria-busy', value);

    if (value) {
      const scrollPosition =
        document.documentElement.scrollTop || document.body.scrollTop;

      this.refs.list.focus();

      window.requestAnimationFrame(() => {
        document.documentElement.scrollTop = document.body.scrollTop = scrollPosition;
      });
    }

    this.refs.submits.forEach((el) => {
      el.disabled = value;
      if (value) {
        el.classList.add('loading');
      }
    });
  }

  get nameFirst() {
    return this.data.nameFirst;
  }

  set nameFirst(value) {
    this.data.nameFirst = value;

    this.displayResults();
  }

  get results() {
    return this.data.results;
  }

  set results(value) {
    this.data.results = value;

    this.data.sortedResults = this.sortList(value);

    this.displayResults();
  }

  get random() {
    return this.data.random;
  }

  set random(value) {
    this.data.random = value;

    this.displayResults(this.results);
  }
  get sortedResults() {
    return this.data.sortedResults;
  }

  set sortedResults(value) {
    this.data.sortedResults = value;

    this.displayResults();
  }
}

new Names();
