const chalk = require('chalk');

const locale = new Intl.Locale('ru-RU');
const localeConfig = { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };

const request = (method, url, isProxy) => {
    let methodStr;


    switch (method) {
        case 'GET':
            methodStr = chalk.bold.bgGreen(' GET ');
            break;
        case 'POST':
            methodStr = chalk.bold.bgMagenta(' POST ');
            break;
        case 'PUT':
            methodStr = chalk.bold.bgBlue(' PUT ');
            break;
        case 'DELETE':
            methodStr = chalk.bold.bgRed(' DELETE ');
            break;
        case 'OPTION':
            methodStr = chalk.bold.bgWhite(' OPTION ');
            break;
        default:
            methodStr = '';
            break;
    }

    return (status) => {
        let statusStr;

        if (status >= 200 && status <= 299) {
            statusStr = chalk.greenBright(status);
        } else if (status >= 300 && status <= 399) {
            statusStr = chalk.yellow(status);
        } else if (status >= 400 && status <= 599) {
            statusStr = chalk.red(status);
        } else {
            statusStr = status;
        }

        console.info(`[${new Date().toLocaleTimeString(locale, localeConfig)}] ${methodStr} | ${statusStr} ${isProxy ? chalk.italic('PROXY ') : ''}${url}`);
    };
};

const start = (port) => {
    console.clear()
    console.log(chalk.bgGreen('                                        '));
    console.log();
    console.log(`    🤯 PROXY START`);
    console.log('       Open:', chalk.blue.underline(`http://localhost:${port}`));
    console.log();
    console.log(chalk.bgGreen('                                        '));
    console.log();
};

module.exports = {
    proxyRequest: request,
    start
};