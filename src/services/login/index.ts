import { Response } from "@/api_models/Response"
import { request } from "@umijs/max"
import { GET_ANY, host } from "../request"
import { LoginDTO, LoginInfo, UserInfo } from "./typings"

export const helloWorld = () => {
    return request('/', {})
}

/**
 * 登录
 * @param login
 */

export const login = async (
    data: LoginDTO
) => {
    return request<Response<LoginInfo>>(
        host + '/login', 
        {
            method: 'POST', 
            data
        }
    )
}

export const captcha = async () => {
    const res = await request(
        host + `/captcha`, 
        {
            params: { type: 'base64' }
        }
    )
    if(res?.code === 1000) {
        return res.data
    } else {
        return { captchaId: '', data: '' }
    }
}

/**
 * 刷新token
 */
export const fetchRefreshToken = async (
    refreshToken: string
) => {
    return await request(
        host + `/refreshToken`, 
        {
            params: { refreshToken }
        }
    )
}

export const fetchUserInfo = async () => {
    return GET_ANY<UserInfo | {}>('/user/info', {})
}