const Login = require('./Login');

module.exports = class Header {
  constructor(selector = '') {
    this.selector = `${selector} xc-header`;
    this.login = new Login();
  }

  doLogin(email, password) {
    browser.click(this.getMenuItem(3)); // Login Item
    this.login.doLogin(email, password);
  }
  getMenuItem(index = 1) {
    return `${this.selector} > nav > span > a:nth-child(${index})`;
  }
};
