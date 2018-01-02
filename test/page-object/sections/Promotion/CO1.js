module.exports = class CO1 {
  constructor(prefix = '') {
    this.selector = `${prefix} xc-media-box-co1`;

    this.loader = `${this.selector} .loading`;
  }

  get(index = 1) {
    const selector = `${this.selector}  > .promo-item:nth-child(${index}) `;
    return {
      selector,
      title: `${selector} .box-title`,
      description: `${selector} .box-abstract`,
    };
  }
};
