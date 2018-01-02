const Input = require('../components/Input');

module.exports = class Login {
  constructor(selector = '') {
    this.selector = `${selector} xc-cres-login-form`;
    this.email = new Input(`${this.selector} > form > div:nth-child(2) mat-form-field`);
    this.password = new Input(`${this.selector} > form > div:nth-child(3) mat-form-field`);
    this.loginButton = `${this.selector} > form > button`;
  }

  doLogin(email, password) {
    browser.setValue(this.email.input, email);
    browser.setValue(this.password.input, password);
    browser.click(this.loginButton);
  }
};
