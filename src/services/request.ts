/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
 import { extend } from 'umi-request';
 import { notification, message } from 'antd';
 import { ResponseError } from 'umi-request';
 import { Response } from '@/api_models/Response';
 import { Page } from '@/api_models/Page';
import { getToken } from '@/utils/utils';
import SignOut from '@/utils/SignOut';
 
export const host = 'http://localhost:7070'
 // console.log('host', host)
 
 const codeMessage = {
     200: '服务器成功返回请求的数据。',
     201: '新建或修改数据成功。',
     202: '一个请求已经进入后台排队（异步任务）。',
     204: '删除数据成功。',
     400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
     401: '用户没有权限（令牌、用户名、密码错误）。',
     403: '用户得到授权，但是访问是被禁止的。',
     404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
     406: '请求的格式不可得。',
     410: '请求的资源被永久删除，且不会再得到的。',
     422: '当创建一个对象时，发生一个验证错误。',
     500: '服务器发生错误，请检查服务器。',
     502: '网关错误。',
     503: '服务不可用，服务器暂时过载或维护。',
     504: '网关超时。',
 }
 
 /**
  * 异常处理程序
  */
 const errorHandler = (error: ResponseError<any>) => {
     const { response } = error;
 
     if (response && response.status) {
         if (response.status == 413) {
             const {
                 status,
                 url
             } = response;
             notification.error({
                 message: `请求错误 ${status}: ${url}`,
                 description: `${error.data.detail}`,
             });
         } else {
             const errorText = codeMessage[response.status] || response.statusText;
             const { status, url } = response;
             notification.error({
                 message: `请求错误 ${status}: ${url}`,
                 description: errorText,
             });
         }
 
     } else if (!response) {
         notification.error({
             description: '您的网络发生异常，无法连接服务器',
             message: '网络异常',
         });
         return {}
     }
 
     return response;
 }
 
 /**
  * 配置request请求时的默认参数
  */
 const request = extend({
     errorHandler,
     // 默认错误处理
     // credentials: 'include', // 默认请求是否带上cookie
 });
 
 // 中间件
 message.config({
     top: 60,
     duration: 1.5,
     maxCount: 3,
 });
 request.use(async (ctx, next) => {
     const { req } = ctx;
     const { options } = req;
     // 判断是否需要添加前缀，如果是统一添加可通过 prefix、suffix 参数配置
     // if (url.indexOf('/api') !== 0) {
     //   ctx.req.url = `/api/v1/${url}`;
     // }
     // console.log('getUserInfo()', getUserInfo())
     // 判断是否有token, 没有就添加
 
     // @ts-ignore
     if (!options?.headers?.token) {
         const { token } = getToken()
         ctx.req.options.headers!['authorization'] = `${token}`
         ctx.req.options.headers!['Content-type'] = 'application/json'
     }
 
     await next();
 
     // 验证登录信息是否过期
     const { res } = ctx;
     if (res && res.code === 401
         //  && !req.url.includes(logOutUrl) 
         //  && !req.url.includes(accessLoginUrl)
     ) {
         // 退出登录
         notification.error({
             description: '请重新登录',
             message: '登陆信息失效',
         });
         SignOut()
     };
 });
 
 
 //封装请求
 export const GET_ANY = async<T = any>(url: string, t: T, params?: object | URLSearchParams): Promise<T> => {
     return request
         .get(host + url, { params })
         .then((res: Response<T>) => {
             if (res?.code === 1000) {
                 return res.data!
             } else {
                 res.message && message.warning(`${res.message}`)
                 return t
             }
         })
 }
 
 export const GET_ARR = async<T>(url: string, params?: object | URLSearchParams): Promise<Page<T>> => {
     return request(host + url, {
         method: 'GET',
         params
     })
         .then((res: Response<T[]>) => {
             if (res?.code === 1000) {
                 return {
                     list: res.data!,
                     total: res.total!
                 }
             } else {
                 res.message && message.warning(`${res.message}`)
                 return new Page<T>()
             }
 
         })
 }
 
 export const POST_ANY = async<T = any>(url: string, data: any, msg?: string): Promise<Response<T>> => {
     return request
         .post(host + url, { data })
         .then((res: Response<T>) => {
             if (res?.code === 1000) {
                 msg && message.success(msg)
             } else {
                 res.message && message.warning(`${res.message}`)
             }
             return res
         })
 }
 
 export const POST_ARR = async<T>(url: string, data: any): Promise<Page<T>> => {
     return request
         .post(host + url, { data })
         .then((res: Response<T[]>) => {
             if (res?.code === 1000) {
                 return {
                     list: res.data!,
                     total: res.total!
                 }
             } else {
                 res.message && message.warning(`${res.message}`)
                 return new Page<T>()
             }
 
         })
 }
 
 export const PUT_ANY = async<T>(url: string, data: any, msg?: string) => {
     return request
         .put(host + url, { data })
         .then((res: Response<T>) => {
             if (res?.code === 1000) {
                 msg && message.success(`${msg}`)
             }
             else if (res?.message === "获取借阅列表失败！") {
                 // 暂不输出借阅车报错的bug
             }
             else {
                 res?.message && message.warning(`${res.message}`)
             }
             return res
         })
 }
 
 export const DELETE = async (url: string, msg?: string, data?: any) => {
     return request
         .delete(host + url, { data })
         .then((res: any) => {
             if (res?.code === 1000) {
                 msg && message.success(`${msg}`)
             } else {
                 res?.message && message.warning(`${res.message}`)
             }
             return res
         })
 }
 
 export default request