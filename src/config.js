const pe = process.env;

const config = {
  jira: {
    username: pe.JIRA_USER || '',
    password: pe.JIRA_PASSWORD || '',
    server: pe.JIRA_SERVER || '',
  },
  socket: {
    server: pe.SOCKET_SERVER || '',
  }
};

module.exports = config;
