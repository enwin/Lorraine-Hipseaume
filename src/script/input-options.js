class InputOption {
  constructor(el) {
    this.el = el;

    this.refs = {
      progress: this.el.querySelector('.progress span'),
      inputs: Array.from(this.el.querySelectorAll('input')),
      actions: this.el.querySelector('.input-option-actions'),
    };

    this.data = {
      focusWithin: false,
    };

    this.bind();

    this.data = {
      progressSize: undefined,
      progressIndex: undefined,
      inputs: this.refs.inputs.length,
    };

    this.setProgressSize();

    this.progressIndex = this.refs.inputs.findIndex((el) => el.checked);
  }

  bind() {
    this.el.addEventListener('change', (event) => {
      this.updateProgress(event);
    });

    this.refs.actions.addEventListener('click', (event) => {
      event.stopPropagation();
      event.preventDefault();
      this.changeOption(event.target);
    });

    this.el.addEventListener(
      'focus',
      (event) => {
        this.focusWithin = event.type === 'focus';
      },
      true,
    );

    this.el.addEventListener(
      'blur',
      (event) => {
        this.focusWithin = event.type === 'focus';
      },
      true,
    );
  }

  changeOption(el) {
    const increment = el.closest('.prev') ? -1 : +1;
    const max = this.inputCount - 1;
    let nextIndex = this.progressIndex + increment;

    if (nextIndex > max) {
      nextIndex = 0;
    } else if (nextIndex < 0) {
      nextIndex = max;
    }

    this.refs.inputs[nextIndex].click();
  }

  setProgressSize() {
    this.progressSize = 100 / this.inputCount;
  }

  updateProgress(event) {
    const selectedIndex = this.refs.inputs.findIndex(
      (el) => el === event.target,
    );

    this.progressIndex = selectedIndex;
  }

  get focusWithin() {
    return this.data.focusWithin;
  }

  set focusWithin(value) {
    this.data.focusWithin = value;
    this.el.classList.toggle('focus-within', value);
  }

  get progressIndex() {
    return this.data.progressIndex;
  }

  set progressIndex(value) {
    this.data.progressIndex = value;

    this.el.style.setProperty(
      '--progress-index',
      `${value * (100 / (this.inputCount - 1))}%`,
    );
  }

  get inputCount() {
    return this.data.inputs;
  }

  get progressSize() {
    return this.data.progressSize;
  }

  set progressSize(value) {
    this.data.progressSize = value;

    const delta = value + value / (this.inputCount - 1);

    this.el.style.setProperty('--progress-shift', `${value}%`);
    this.el.style.setProperty('--progress-width', `${delta}%`);
  }
}

export default (context = document) => {
  Array.from(context.querySelectorAll('.input-option')).map((el) => {
    return new InputOption(el);
  });
};
