const path = require('path');
const url = require('url');
const rp = require('request-promise');
const program = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');

const defaultEndpoint = 'https://gateway-fra.watsonplatform.net/assistant/api';
program
    .version('0.0.1')
    .usage('-p "*******" -w "f3b99199-c8cb-4e2b-b88d-3a148856e8ac" [-u "' + defaultUser + '"] [-a "' + defaultEndpoint + '"] ')
    .option('-e, --endpoint [url]', 'Watson Assistant API endpoint')
    .option('-u, --user [string]', 'Username')
    .option('-p, --password [string]', 'Password')
    .option('-w, --workspace [string]', 'Workspace ID')
    .option('-f, --file [string]', 'Path to skill json that will be imported')
    .option('-s, --silent', 'Deactivate interactive mode. It will create all found indexes')
    .parse(process.argv);

const defaultUser = 'apikey';

if (!program.endpoint || url.parse(program.endpoint).host === null) {
    console.log(chalk.bold.green('Using default endpoint "' + defaultEndpoint + '"'));
    program.user = defaultEndpoint;
}

if (!program.user) {
    console.log(chalk.bold.green('Using default username "' + defaultUser + '"'));
    program.user = defaultUser;
}

if (!program.password) {
    console.error(chalk.bold.red('Please provide a password!'));
    process.exit(1);
}

if (!program.workspace) {
    console.log(chalk.bold.green('A new skill will be created because no workspace ID has been provided!'));
    process.exit(1);
}

function quitProgram(pExit) {
    if (!pExit) {
        console.log(chalk.green('All done!'));
    } else {
        console.log(chalk.bold.red('There were errors!'));
        process.exit(pExit);
    }
}

const questions = [{
    type: 'string',
    default: defaultUser,
    name: '',
}, {
    type: 'string',
    default: defaultEndpoint,
    name: '',
}];

let promise;
if (!program.silent) {
    promise = inquirer.prompt(questions);
} else {
    promise = Promise.resolve();
}

promise.then((answers) => {
    const options = {
        uri: program.endpoint,
        qs: {
            access_token: 'xxxxx xxxxx' // -> uri + '?access_token=xxxxx%20xxxxx'
        },
        headers: {
            'User-Agent': 'Request-Promise'
        },
        json: true // Automatically parses the JSON string in the response
    };

    rp(options).then((body) => {
        return quitProgram(0);
    }).catch((error) => {
        quitProgram(1, errors);
    });
});
