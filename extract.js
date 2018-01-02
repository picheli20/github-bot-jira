fs = require('fs')

fs.readFile('./test/playground.js', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }

  let code = data.split('// Default header - Change only the URL value if necessary\n')[1]
                  .split('\n// Default footer - do not change')[0];

  fs.writeFile(
    'output.txt',
    `+e2e test+\n{code:javascript}${code}{code}`,
    (err) => err && console.log(err),
  );
});
