require('dotenv').config();

const chalk = require('chalk');

const routes = require('./routes.json');


envs = process.env;


if (!envs.API || !envs.BUILD_DIR) {
    console.error();
    console.error(chalk.red('ENV ERROR!!!'));
    console.error();
    process.exit(1);
}

if (!routes.length) {
    console.error();
    console.error(chalk.red('ROUTES ERROR!!!'));
    console.error();
    process.exit(1);
}

module.exports = {
    port: process.env.PORT ?? 3000,
    apiURL: process.env.API,
    apiRoutes: routes,
    serveConfig: {
        public: process.env.BUILD_DIR,
        symlinks: true,
        directoryListing: false,
        renderSingle: true,
        // cleanUrls: false
        rewrites: [{
            source: '**',
            destination: "/index.html",
        }]
    },
    logs: {
        proxy: true,
        static: true
    }
};