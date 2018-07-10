const Koa = require('koa');
const axios = require('axios');
const cors = require('koa2-cors');
const bodyParser = require('koa-bodyparser');
const app = new Koa();
const okapiHost = '10.10.168.250';
const okapiPort = '9130';
app.use(bodyParser());

const main = async (ctx) => {
    try {
        var instance = axios.create();
        let headers = ctx.headers;
        delete headers.origin;
        delete headers.referer;
        let r = await instance({
            method: ctx.method,
            url: `http://${okapiHost}:${okapiPort}${ctx.originalUrl}`,
            validateStatus: function (status) {
                return status < 600;
            },
            headers: headers,
            data: ctx.request.rawBody
        });
        ctx.response.set({ ...r.headers });
        ctx.response.status = r.status;
        ctx.response.body = r.data;
        instance = null;
    }
    catch (error) {
        ctx.response.status = error.response.status;
        ctx.response.body = error.response.data;
    }

};
app.use(cors({
    "origin": ctx => '*',
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization', 'x-okapi-tenant', 'x-okapi-token', 'x-okapi-module-permissions', 'x-okapi-permissions'],
    maxAge: 10,
    credentials: true,
    allowMethods: ['POST', 'DELETE', 'HEAD', 'PUT'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'x-okapi-tenant', 'x-okapi-token'],
}));
app.use(main).listen(4000);
console.log('proxy-okapi is starting at port 4000');
