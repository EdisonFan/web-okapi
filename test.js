var raml = require("raml-1-parser");
var path = require("path");
let c=path.resolve(__dirname, "./raml/raml-util/ramls/mod-login/login.raml");
var api = raml.loadApiSync(c);

api.errors().forEach(function(x){
    console.log(JSON.stringify({
        code: x.code,
        message: x.message,
        path: x.path,
        start: x.start,
        end: x.end,
        isWarning: x.isWarning
    },null,2));
});

console.log( "Some method name: " + api);

console.log(JSON.stringify(api.toJSON(), null, 2));