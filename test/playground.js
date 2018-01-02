const URL_ELNEW = 'https://eurolotto-staging.herokuapp.com/';
const URL_CRES = 'https://cresus-staging.herokuapp.com/';

const assert = require('assert');
const pageObject = require('./page-object');

describe('Jira Automated Test', () => {
// Default header - Change only the URL value if necessary

  it ('should test button of component X', () => {
    browser.url(URL_CRES);
    pageObject.Header.doLogin('john.doe', 'urmom');
    /** code */
    assert.equal(true, true);
  });

// Default footer - do not change
});
