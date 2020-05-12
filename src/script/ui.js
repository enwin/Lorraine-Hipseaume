class Ui {
  constructor() {
    this.data = {};
    this.tick = {};
    this.observers = {};

    window.addEventListener('resize', event => {
      this.resized();
    });

    window.addEventListener(
      'scroll',
      event => {
        this.scrolled();
      },
      {
        passive: true,
      },
    );

    if (window.PointerEvent) {
      window.addEventListener('pointerdown', event =>
        this.detectInputType(event),
      );
      window.addEventListener('pointermove', event =>
        this.detectInputType(event),
      );
    } else {
      window.addEventListener('mousemove', event =>
        this.detectInputTypeFallback(event),
      );
      window.addEventListener('touchstart', event =>
        this.detectInputTypeFallback(event),
      );
    }

    window.addEventListener('keydown', event => this.handleKeys(event));

    this.resized();
    this.scrolled();
  }

  detectInputType(event) {
    this.inputType = event.pointerType;
  }

  detectInputTypeFallback(event) {
    this.inputType = event.type === 'mousemove' ? 'mouse' : 'touch';
  }

  handleKeys() {
    this.inputType = 'keyboard';
  }

  observe(property, callback, immediate = false) {
    if (!this.observers[property]) {
      this.observers[property] = [];
    }

    const length = this.observers[property].push(callback);

    const unobserver = () => {
      this.observers[property].splice(length - 1, 1);
    };

    if (immediate && this.data[property]) {
      callback(this.data[property]);
    }

    return unobserver;
  }

  resized() {
    this.height = window.innerHeight;
    this.width = window.innerWidth;
  }

  scrolled() {
    this.scrollY = window.scrollY;
  }

  signal(entry, value) {
    if (this.tick[entry]) {
      window.cancelAnimationFrame(this.tick[entry]);
    }

    this.tick[entry] = window.requestAnimationFrame(() => {
      if (this.observers[entry]) {
        this.observers[entry].forEach(callback => callback(value));
      }
      this.tick[entry] = null;
    });
  }

  set height(value) {
    if (value !== this.data.height) {
      this.data.height = value;
      this.signal('height', value);
    }
  }

  get height() {
    return this.data.height;
  }

  set inputType(value) {
    this.data.inputType = value;
    document.documentElement.setAttribute('data-input', value);
  }

  set scrollY(value) {
    if (value !== this.data.scrollY) {
      this.data.scrollY = value;
      this.signal('scrollY', value);
    }
  }

  get scrollY() {
    return this.data.scrollY;
  }

  set width(value) {
    if (value !== this.data.width) {
      this.data.width = value;
      this.signal('width', value);
    }
  }

  get width() {
    return this.data.width;
  }
}

export default new Ui();
