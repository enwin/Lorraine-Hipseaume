class InputOption {
  constructor(el) {
    this.el = el;

    this.refs = {
      progress: this.el.querySelector('.progress span'),
      inputs: Array.from(this.el.querySelectorAll('input')),
    };

    this.bind();

    this.data = {
      progressSize: undefined,
      progressIndex: undefined,
    };

    this.setProgressSize();

    this.progressIndex = this.refs.inputs.findIndex((el) => el.checked);
  }

  bind() {
    this.el.addEventListener('input', (event) => {
      this.updateProgress(event);
    });
  }

  setProgressSize() {
    this.progressSize = 100 / this.refs.inputs.length;
  }

  updateProgress(event) {
    const selectedIndex = this.refs.inputs.findIndex(
      (el) => el === event.target,
    );

    this.progressIndex = selectedIndex;
  }

  get progressIndex() {
    return this.data.progressIndex;
  }

  set progressIndex(value) {
    this.data.progressIndex = value;
    this.el.style.setProperty(
      '--progress-index',
      `${value * (100 / (this.refs.inputs.length - 1))}%`,
    );
  }

  get progressSize() {
    return this.data.progressSize;
  }

  set progressSize(value) {
    this.data.progressSize = value;
    this.el.style.setProperty('--progress-width', `${value}%`);
  }
}

export default (context = document) => {
  Array.from(context.querySelectorAll('.input-option')).map((el) => {
    return new InputOption(el);
  });
};
