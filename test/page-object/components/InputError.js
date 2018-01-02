module.exports = class inputError {
  constructor(selector = '') {
    this.selector = `${selector} xc-form-errors`;
    this.text = `${this.selector} .form-control-feedback > div:nth-child(1) > span`;
  }

  hasError() {
    return browser.isVisible(this.text);
  }
}
