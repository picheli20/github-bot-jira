var inputError = require('./inputError');

module.exports = class Input {
  constructor(selector = '') {
    this.selector = `${selector}`;
    this.input = `${this.selector} input`;
    this.error = new inputError(selector);
  }
}
