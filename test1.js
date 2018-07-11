const axios = require('axios');
let instance = axios.create({
    baseURL: 'http://www.baidu.com8',
    validateStatus: function (status) {
        return status < 300;
    }
});

instance.interceptors.response.use(
    res => {
       
        return res;
    },
    error => {
        return Promise.reject(error);
    }
);




var start = async function () {
    try {
        console.log('start');
        await instance.get('xx'); // 这里得到了一个返回错误
        
        // 所以以下代码不会被执行了
        console.log('end');
    } catch (err) {
        console.log(err); // 这里捕捉到错误 `error`
    }
};
start();