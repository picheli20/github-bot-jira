const path = require('path');
var fs = require('fs');
const JiraApi =  require('jira-client');
const childProcess = require('child_process');

const config = require('./src/config');
const server = config.socket.server || 'http://localhost:3000';
const socket = require('socket.io-client')(server);

const STATUS = {
  review: 891,
  approved: 901,
  close: 701,
  reopen: 821
}

const jira = new JiraApi({
  protocol: 'https',
  host: config.jira.server,
  username: config.jira.username,
  password: config.jira.password,
  apiVersion: '2',
  strictSSL: true
});

socket.on('connect', () => console.log(`[log] Connected on ${server}`));
socket.on('disconnect', () => console.log(`[log] Disconnect from the server`));

socket.on('initialsetup', data => {
  data.issues.map(issue => {
    console.log(`[${issue}] initial setup`);
    jira.addComment(issue, data.comment);

    // Replace ISSUE_ID
    // https://jira.xcaliber.io/rest/api/2/issue/<ISSUE_ID>/transitions?expand=transitions.fields
    jira.transitionIssue(issue, {
      transition: { id: STATUS.review }
    });

  });
});

socket.on('approved', data => {
  data.issues.map(issue => {
    console.log(`[${issue}] approved`);
    jira.transitionIssue(issue, {
      transition: { id: STATUS.approved }
    });

    jira.findIssue(issue).then(issueObj => {
      runTest(processDescription(issueObj, issue), issue, data.deployedUrl, error => {
        if (error) socket.emit('e2e:fail', { pr: data.pr });
        else socket.emit('e2e:success', { pr: data.pr });
      });
    });
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

socket.on('merged', data => {
  data.issues.map(issue => {
    console.log(`[${issue}] merged`);

    // jira.findIssue(issue).then(issueObj => {
    //   if (issueObj.fields.status.name.toLocaleLowerCase() !== 'resolved'){
    //     return;
    //   }

    //   jira.transitionIssue(issue, { transition: { id: STATUS.close } });
    // }).catch(err => {
    //   console.error(err);
    // });
  });
});

function runTest(testString, issue, deployedUrl, callback) {
  if(!testString) return;

  const file = path.join(__dirname, `./test/temp/${issue}.${getRandomInt(1000000, 9999999)}.e2e.js`);
  fs.writeFile(file, createFile(testString, deployedUrl), (err) => {
    if(err) return console.log(err);

    console.log(`[${issue}] Running e2e test`);
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
    console.log(`[${issue}] No E2E tag found`);
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

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
