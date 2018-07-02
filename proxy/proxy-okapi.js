const Koa = require('koa')
const axios = require('axios');
const cors = require('koa2-cors');
const bodyParser = require('koa-bodyparser');
const koaBody = require('koa-body');
const app = new Koa();
const okapiHost='localhost'
const okapiPort='9130'
app.use(bodyParser());
const addObj=JSON.parse(`{
    "id": "mod-mymodule-1.0.0",
    "name": "mymodule",
    "provides": [
      {
        "id": "mymodule",
        "version": "1.0",
        "handlers" : [
          {
            "methods": [ "GET" ],
            "pathPattern": "/ebooks/{title}",
            "permissionsRequired": [ ]
          }
        ]
      }
      
    ]
  }
  `)
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
      return 'http://localhost:3000'; 
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
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