const queryString = require('query-string');
let parsed={}
parsed.foo = undefined;
parsed.ilike = 'pizza';
 
const stringified = queryString.stringify(parsed);

class A {
    constructor() {
        this.x = 1;
        this.mm={
            f:this.cc()
        };
    }
    

    cc(){
        console.log(2);
        
    } 
}
let a=new A();
a.mm.f();

