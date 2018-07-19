const Koa = require('koa');
const axios = require('axios');
const cors = require('koa2-cors');
const bodyParser = require('koa-bodyparser');
const app = new Koa();

app.use(bodyParser());

const main = async (ctx) => {
    try {
        var instance = axios.create();
        let headers = ctx.headers;
        let okapiHost=headers.okapihost;
        delete headers.origin;
        delete headers.referer;
        let r = await instance({
            method: ctx.method,
            url: `${okapiHost}${ctx.originalUrl}`,
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
        ctx.response.status = 404;
        ctx.response.body = error.toString();
    }

};
app.use(cors({
    "origin": ctx => '*',
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization', 'x-okapi-tenant', 'x-okapi-token', 'x-okapi-module-permissions', 'x-okapi-permissions'],
    maxAge: 10,
    credentials: true,
    allowMethods: ['POST', 'DELETE', 'HEAD', 'PUT'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'okapiHost','x-okapi-tenant', 'x-okapi-token'],
}));
app.use(main).listen(4000);
console.log('proxy-okapi is starting at port 4000'); 
