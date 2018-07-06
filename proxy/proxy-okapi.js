const Koa = require('koa')
const axios = require('axios');
const cors = require('koa2-cors');
const bodyParser = require('koa-bodyparser');
const app = new Koa();
const okapiHost='10.10.168.250'
const okapiPort='9130'
app.use(bodyParser());

const main=async ( ctx ) => {

    switch (ctx.method) {
        case "DELETE":
            await DeleteHandle(ctx);
            break;
        case "POST":
            await PostHandle(ctx);
            break;
        case "GET":
            await GetHandle(ctx);
            break;
        case "PUT":
            await PutHandle(ctx);
            break;
        default:
            break;
    }
    
}
app.use(cors({
    origin: function(ctx) {
      return '*'; 
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept','x-okapi-token'],
  }));
app.use(main).listen(4000)
console.log('proxy-okapi is starting at port 4000')

async function DeleteHandle(ctx) {
    try {
        let r = await axios({
            method: "DELETE",
            url: `http://${okapiHost}:${okapiPort}${ctx.path}`,
            validateStatus: function (status) {
                return status >= 200 && status < 500;
            }
        });
        ctx.response.status = r.status;
        ctx.response.body = r.data;
    }
    catch (error) {
        // ctx.response=error.response;
        ctx.response.status = error.response.status;
        ctx.response.body = error.response.data;
    }
}
async function PostHandle(ctx) {
    try {
        let r = await axios({
            method: "POST",
            url: `http://${okapiHost}:${okapiPort}${ctx.path}`,
            validateStatus: function (status) {
                return status >= 200 && status < 500;
            },
            data:ctx.request.rawBody
        });
        ctx.response.status = r.status;
        ctx.response.body = r.data;
    }
    catch (error) {
        ctx.response.status = error.response.status;
        ctx.response.body = error.response.data;
    }
}

async function GetHandle(ctx) {
    try {
        let r = await axios({
            method: "GET",
            url: `http://${okapiHost}:${okapiPort}${ctx.path}`,
            validateStatus: function (status) {
                return status >= 200 && status < 500;
            },
            headers:ctx.headers
        });
        ctx.response.status = r.status;
        ctx.response.body = r.data;
    }
    catch (error) {
        // ctx.response=error.response;
        ctx.response.status = error.response.status;
        ctx.response.body = error.response.data;
    }
}