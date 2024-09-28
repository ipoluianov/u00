class WidgetText extends Widget {
  constructor() {
    super();
    this._text = '';
  }

  setText(text) {
    this._text = text;
    this._render();
  }

  _render() {
    this._el.innerHTML = this._text;
  }
}