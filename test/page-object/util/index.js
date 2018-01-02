const Login = require('../sections/Login');
const Header = require('../sections/Header');

module.exports = {
  login: (url, email, password) => {
    browser.url(url);

    browser.click(Header.loginButton);

    browser.setValue(Login.email.input, email);
    browser.setValue(Login.password.input, password);
    browser.click(Login.loginButton);
  }
};
