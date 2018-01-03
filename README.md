# Getting started

#### Create automated testes using [webdriver](http://webdriver.io/api.html) and [mochajs](https://mochajs.org/).


- You can use the `playground.js` file to create your test (just don't add stuff on the header or footer, change only the URL if necessary)

To run the tests you can run:
```
npm run playground
```

When you want to generate the final file, you can run `npm run playground:generate`, it will create a file called `output.txt`, just copy and paste on the Jira description.

It looks like this:
```
+e2e test+
{code:javascript}
  it ('should test button of component X', () => {
    pageObject.do.login(URL_<PROJECT>, 'john.doe', 'urmom');
    /** code */
    assert.equal(true, true);
  })
{code}
```

- The URL variable is inject dynamically with the prefix URL_ followed by the project prefix f.e.`URL_ELNEW, URL_CRES`.

- Tests will be trigged when the respective PR is move to rft, if failed it will be provided a url to re-run the test.

- You can use the pre-created functions/selectors of `test/page-object/index.js` as `pageObject` variable.

## Contributing 
For starting the server:
```
npm run start
```

Please check `src/config.js` to see the env variables.
