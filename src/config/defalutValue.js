const defaultValue = {
    modules: {
        add: `
        {
            "id" : "folio-hello-vertx-0.1-SNAPSHOT",
            "name" : "Hello World",
            "provides" : [ {
              "id" : "hello",
              "version" : "1.1",
                "handlers" : [ {
                  "methods" : [ "GET", "POST" ],
                  "pathPattern" : "/hello"
                } ]
            } ]
        }
        `,
    },
    deploy: {
        add: (srvcId)=>`
        {
            "srvcId": "${srvcId}",
            "instId":"localhost-8080",
            "url":"http://localhost:8080"
        }
        `
    },
    user:{
        add:`
        {
            "id": "adminId",
            "type": "patron",
            "active": true,
            "username": "admin",
            "patronGroup": "f7c3ae31-78a7-43ec-b9b7-e76669cad22f"
        }
        `
    }
};
export default defaultValue;