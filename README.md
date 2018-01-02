# Getting started

#### Create automated testes using [webdriver](http://webdriver.io/api.html) and [mochajs](https://mochajs.org/).


- Add this pattern on Jira description
```
+e2e test+
{code:javascript}
describe('My Description', () => {
  it ('should test button of component X', () => {
    pageObject.do.login(URL_<PROJECT>, 'john.doe', 'urmom');
    /** code */
    assert.equal(true, true);
  })
});
{code}
```

- The URL variable is inject dynamically with the prefix URL_ followed by the project prefix f.e.`URL_ELNEW, URL_CRES`.

- Tests will be trigged when the respective PR is created, if failed it will be provided a url to re-run the test.

- You can use the pre-created functions of `test/page-object.js` as `pageObject` variable.

## Contributing 
For starting the server:
```
npm run start
```

Please check `src/config.js` to see the env variables.
