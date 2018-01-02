const CO1 = require('../sections/Promotion/CO1');

module.exports = class Offers {
  constructor(selector = '') {
    this.selector = `${selector} xc-cres-offers`;
    this.promotion = new CO1(this.selector);
  }
};
