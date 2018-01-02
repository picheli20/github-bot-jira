const Input = require('../components/Input');

const Login = {
  email: new Input('xc-cres-login-form > form > div:nth-child(2) mat-form-field'),
  password: new Input('xc-cres-login-form > form > div:nth-child(3) mat-form-field'),
  loginButton: 'xc-cres-login-form > form > button'
};

module.exports = Login;
