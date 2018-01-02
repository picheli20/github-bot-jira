const URL_ELNEW = 'https://eurolotto-staging.herokuapp.com/';
const URL_CRES = 'https://cresus-staging.herokuapp.com/';

const assert = require('assert');
const pageObject = require('./page-object');

// Default header - Change only the URL valud if necessary

describe('My Description', () => {
  it ('should test button of component X', () => {
    pageObject.util.login(URL_CRES, 'john.doe', 'urmom');
    /** code */
    assert.equal(true, true);
  })
});
