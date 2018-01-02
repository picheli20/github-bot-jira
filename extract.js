fs = require('fs')

fs.readFile('./test/playground.js', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }

  fs.writeFile(
    'output.txt',
    `+e2e test+\n{code:javascript}${data.split('// Default header - Change only the URL valud if necessary\n')[1]}{code}`,
    (err) => err && console.log(err),
  );
});
