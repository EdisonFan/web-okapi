const Koa = require('koa');
const axios = require('axios');
const cors = require('koa2-cors');
const bodyParser = require('koa-bodyparser');
const app = new Koa();
const okapiHost='222.29.81.101';
const okapiPort='9130';
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
    
};
app.use(cors({
    "origin": ctx=>'*',
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization','x-okapi-tenant','x-okapi-token'],
    maxAge: 86400,
    credentials: true,
    allowMethods: ['POST', 'DELETE', 'PUT'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept','x-okapi-tenant','x-okapi-token'],
  }));
app.use(main).listen(4000);
console.log('proxy-okapi is starting at port 4000');

async function DeleteHandle(ctx) {
    try {
        var instance = axios.create();
        instance.interceptors.request.use(function (config) {
            // 在发送请求之前做些什么
            if(ctx.headers['x-okapi-tenant']){
                config.headers['x-okapi-tenant']=ctx.headers['x-okapi-tenant'];
            }
            if(ctx.headers['x-okapi-token']){
                config.headers['x-okapi-token']=ctx.headers['x-okapi-token'];
            }
            config.headers['Content-Type']=ctx.headers['content-type']||'application/json';
            console.log(config.headers);
            
            return config;
          }, function (error) {
            // 对请求错误做些什么
            return Promise.reject(error);
          });
        let r = await instance({
            method: "DELETE",
            url: `http://${okapiHost}:${okapiPort}${ctx.originalUrl}`,
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

        var instance = axios.create();
        instance.interceptors.request.use(function (config) {
            // 在发送请求之前做些什么
            if(ctx.headers['x-okapi-tenant']){
                config.headers['x-okapi-tenant']=ctx.headers['x-okapi-tenant'];
            }
            if(ctx.headers['x-okapi-token']){
                config.headers['x-okapi-token']=ctx.headers['x-okapi-token'];
            }
            config.headers['Content-Type']=ctx.headers['content-type'];
            console.log(config.headers);
            
            return config;
          }, function (error) {
            // 对请求错误做些什么
            return Promise.reject(error);
          });
        
        let r = await instance({
            method: "POST",
            url: `http://${okapiHost}:${okapiPort}${ctx.originalUrl}`,
            validateStatus: function (status) {
                return  status < 600;
            },
            
            data:ctx.request.rawBody
        });
        ctx.response.set({...r.headers});
        ctx.response.status = r.status;
        ctx.response.body = r.data;
        instance=null;
    }
    catch (error) {
        ctx.response.status = error.response.status;
        ctx.response.body = error.response.data;
    }
}
async function PutHandle(ctx) {
    try {

        var instance = axios.create();
        instance.interceptors.request.use(function (config) {
            // 在发送请求之前做些什么
            if(ctx.headers['x-okapi-tenant']){
                config.headers['x-okapi-tenant']=ctx.headers['x-okapi-tenant'];
            }
            if(ctx.headers['x-okapi-token']){
                config.headers['x-okapi-token']=ctx.headers['x-okapi-token'];
            }
            config.headers['Content-Type']=ctx.headers['content-type'];
            console.log(config.headers);
            
            return config;
          }, function (error) {
            // 对请求错误做些什么
            return Promise.reject(error);
          });
        
        let r = await instance({
            method: "PUT",
            url: `http://${okapiHost}:${okapiPort}${ctx.originalUrl}`,
            validateStatus: function (status) {
                return  status < 600;
            },
            
            data:ctx.request.rawBody
        });
        ctx.response.set({...r.headers});
        ctx.response.status = r.status;
        ctx.response.body = r.data;
        instance=null;
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
            url: `http://${okapiHost}:${okapiPort}${ctx.originalUrl}`,
            validateStatus: function (status) {
                return status < 600;
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