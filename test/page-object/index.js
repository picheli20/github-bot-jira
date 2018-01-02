const Offers = require('./sections/Offers');
const Promotion = require('./sections/Promotion');
const Header = require('./sections/Header');
const SideBar = require('./sections/SideBar');
const Login = require('./sections/Login');
const Wallet = require('./sections/Wallet');
const Register = require('./sections/Register');

const pageObject = {
  Offers: new Offers(),
  Promotion,
  Header: new Header(),
  SideBar,
  Login: new Login(),
  Wallet,
  Register,
};

module.exports = pageObject;
