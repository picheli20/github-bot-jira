const Offers = require('./sections/Offers');
const Promotion = require('./sections/Promotion');
const Header = require('./sections/Header');
const SideBar = require('./sections/SideBar');
const Login = require('./sections/Login');
const Wallet = require('./sections/Wallet');
const Register = require('./sections/Register');
const util = require('./util');

const pageObject = {
  Offers: new Offers(),
  Promotion,
  Header,
  SideBar,
  Login,
  Wallet,
  Register,
  util,
};

module.exports = pageObject;
