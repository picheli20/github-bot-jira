const path = require('path');
var fs = require('fs');
const JiraApi =  require('jira-client');
const childProcess = require('child_process');
const axios = require('axios');
const atob = require('atob');

const config = require('./src/config');
const server = config.socket.server || 'http://localhost:3000';
const socket = require('socket.io-client')(server);
const [username, password] = getCredentials(config.jira.auth);

const STATUS = {
  review: 891,
  approved: 901,
  close: 701,
  reopen: 821
}

const jira = new JiraApi({
  protocol: 'https',
  host: config.jira.server,
  apiVersion: '2',
  strictSSL: true,
  username,
  password
});

socket.on('connect', () => console.log(`${getTime()} - [log] Connected on ${server}`));
socket.on('disconnect', () => console.log(`${getTime()} - [log] Disconnect from the server`));

socket.on('initialsetup', data => {
  data.issues.map(issue => {
    console.log(`${getTime()} - [${issue}] initial setup`);
    jira.addComment(issue, data.comment);


    jira.findIssue(issue).then(issueObj => {
      if (issueObj.fields.status.name.toLocaleLowerCase() !== 'in progress'){
        return;
      }

      // Replace ISSUE_ID
      // https://jira.xcaliber.io/rest/api/2/issue/<ISSUE_ID>/transitions?expand=transitions.fields
      jira.transitionIssue(issue, {
        transition: { id: STATUS.review }
      });
    }).catch(err => console.error(err));

  });
});

socket.on('approved', data => {
  data.issues.map(issue => {
    console.log(`${getTime()} - [${issue}] approved`);

    jira.findIssue(issue).then(issueObj => {
      if (issueObj.fields.status.name.toLocaleLowerCase() !== 'in review'){
        return;
      }

      jira.transitionIssue(issue, {
        transition: { id: STATUS.approved }
      });
    }).catch(err => console.error(err));

    // jira.findIssue(issue).then(issueObj => {
      // runTest(processDescription(issueObj, issue), issue, data.deployedUrl, error => {
      //   if (error) socket.emit('e2e:fail', { pr: data.pr });
      //   else socket.emit('e2e:success', { pr: data.pr });
      // });
    // });
  });
});


socket.on('e2e:run', data => {
  data.issues.map(issue => {
    jira.findIssue(issue).then(issueObj => {
      runTest(processDescription(issueObj, issue), issue, data.deployedUrl, error => {
        if (error) socket.emit('e2e:fail', { pr: data.pr });
        else socket.emit('e2e:success', { pr: data.pr });
      });
    });
  });
});

// { branch: pr.head.ref }
socket.on('falcon:create', data => {
  axios.post(data.url, data.payload)
    .then(resp => console.log(`${getTime()} - [falcon] Branch created, slug:`, data.payload.slug))
    .catch(resp => console.log(`${getTime()} - [falcon] Error falcon:create: slug:`, data.payload.slug ));
});

// { branch: pr.head.ref }
socket.on('falcon:destroy', data => {
  axios.delete(`${data.url}${data.payload.slug}`)
    .then(resp => console.log(`${getTime()} - [falcon] Branch destroyed, slug:`, data.payload.slug))
    .catch(resp => console.log(`${getTime()} - [falcon] Error falcon:destroy slug:`, data.payload.slug ));
});

// { branch: pr.head.ref }
socket.on('screenshot:purge', data => {
  console.log(`${getTime()} - [screenshot] purging ${data.branch}`);
  axios.post(`${config.screenshotUrl}/purge`, data)
    .then(resp => console.log(`${getTime()} - [screenshot] screenshot:create\n`, resp.data))
    .catch(resp => console.log(`${getTime()} - [screenshot] Error screenshot:purge\n`, resp.data, `\t\t request:\n`, data ));
});

// { branch: pr.head.ref, skin, domain }
socket.on('screenshot:create', data => {
  console.log(`${getTime()} - [screenshot]  ${data.skin} - ${data.branch} (${data.domain})`);
  axios.post(`${config.screenshotUrl}/screenshot`, data)
    .then(resp => console.log(`${getTime()} - [screenshot] screenshot:create\n`, resp.data))
    .catch(resp => console.log(`${getTime()} - [screenshot] Error screenshot:create\n`, resp.data, `\t\t request:\n`, data ));
});

socket.on('merged', data => {
  data.issues.map(issue => {
    console.log(`${getTime()} - [${issue}] merged`);

  //   if (issue.startsWith('ELNEW')) {
  //     jira.findIssue(issue).then(issueObj => {
  //       if (issueObj.fields.status.name.toLocaleLowerCase() !== 'resolved'){
  //         return;
  //       }

  //       jira.transitionIssue(issue, { transition: { id: STATUS.close } });
  //     }).catch(err => {
  //       console.error(err);
  //     });
  //  }
  });
});

function runTest(testString, issue, deployedUrl, callback) {
  if(!testString) return;

  const file = path.join(__dirname, `./test/temp/${issue}.${getRandomInt(1000000, 9999999)}.e2e.js`);
  fs.writeFile(file, createFile(testString, deployedUrl), (err) => {
    if(err) return console.log(err);

    console.log(`${getTime()} - [${issue}] Running e2e test`);
    childProcess.execFile(
      `npm`, [ `test`, `--`, `--spec`, file ],
      (err, stdout, stderr) => {
        callback(err);
        fs.unlink(file, (err) => err && console.log(err));
      }
    );
  });
}

function processDescription(issueObj, issue) {
  const e2eString = issueObj.fields.description.split('+e2e test+')[1];
  if(!e2eString) {
    console.log(`${getTime()} - [${issue}] No E2E tag found`);
    return;
  }
  return e2eString.match(/(?:{code:javascript}((?:.*?\r?\n?)*){code})+/g).map(val => val.replace(/{code:javascript}|{code}/g,''))[0];

}

function createFile(str, deployedUrl) {
  let urlVariables = '';
  for (const item in deployedUrl) {
    urlVariables += `const URL_${item} = '${deployedUrl[item]}';\n`;
  }

  return `${urlVariables}
const assert = require('assert');
const pageObject = require('../page-object');
describe('Jira Automated Test', () => {\n${str}\n});
  `;
}

function getCredentials(info) {
  return atob(info).split(':');
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function checkTime(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

function getTime() {
  var today = new Date();
  var h = today.getHours();
  var m = today.getMinutes();
  var s = today.getSeconds();
  // add a zero in front of numbers<10
  m = checkTime(m);
  s = checkTime(s);
  return h + ":" + m + ":" + s;
}
