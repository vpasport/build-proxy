const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const httpProxy = require('http-proxy');
const handler = require('serve-handler');

const { logs } = require('./utils');

const { apiRoutes, port, apiURL, serveConfig, logs: logsConfig } = require('./config');


const routesRegExps = apiRoutes.map(el => new RegExp('^' + el));

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const proxy = httpProxy.createProxyServer({ changeOrigin: true, secure: false });
proxy.on('proxyReq', function (proxyReq, req) {
    if (req.body) {
        let bodyData = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
    }
});


app.use((req, res) => {
    let isProxy = false;

    for (regExp of routesRegExps) {
        if (regExp.test(req.url)) {
            isProxy = true;

            proxy.web(req, res, { target: apiURL });
            break;
        }
    }

    !isProxy && handler(req, res, serveConfig);

    let log;
    if (logsConfig.static) {
        log = logs.proxyRequest(req.method, req.url, isProxy);
    }
    res.on('finish', () => {
        if (logsConfig.proxy && isProxy || logsConfig.static && !isProxy) {
            log && log(res.statusCode);
        }
    });
});

app.listen(port, () => {
    logs.start(port);
});