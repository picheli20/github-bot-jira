const pageObject = {
  Offers: {
    promotion: {
      first: 'xc-cres-offers > xc-modal xc-media-box-co1 > div:nth-child(1) .box-title'
    }
  },
  Promotion: {
    close: 'xc-promotion-modal > xc-modal .modal-header > button',
  },
  Header: {
    loginButton: 'xc-header > nav > span > a:nth-child(3)',
  },
  sideBar: {
    userInfo: 'xc-sidebar .welcome.logged-in',
  },
  Login: {
    emailInput: 'xc-cres-login-form > form > div:nth-child(2) input',
    passwordInput: 'xc-cres-login-form > form > div:nth-child(3) input',
    loginButton: 'xc-cres-login-form > form > button'
  },
  Wallet: {
    payment: {
      visaBtn: 'xc-select-method > div > div:nth-child(1) > button',
    }
  },
  do: {
    login: (url, email, password) => {
      browser.url(url);

      pageObject.do.click(pageObject.Header.loginButton);

      browser.setValue(pageObject.Login.emailInput, email);
      browser.setValue(pageObject.Login.passwordInput, password);
      browser.click(pageObject.Login.loginButton);

      browser.waitForVisible(pageObject.sideBar.userInfo);
    },
    click: selector => {
      browser.waitForVisible(selector);
      browser.click(selector);
    }
  }
}

module.exports = pageObject;
