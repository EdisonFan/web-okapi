const SERVICE_STATUS = {
    ok: 'ok',
    error: 'error'
};
const SERVICE_MESSAGE = {
    success: 'success', //数据返回成功，
    unknown_err: '服务器忙，稍后再试',//未知错误
    login_no_token: '没有返回x-okapi-token',//登陆成功但没有token返回
    login_err_password: '密码错误',
    login_err_tenant: 'x-okapi-tenant错误',//x-okapi-tenant错误
    login_err_username: '没有此用户',//用户名错误
    no_suitable_module_found:'没有发现模块',//可能是地址写错了
};
export { SERVICE_STATUS,SERVICE_MESSAGE };