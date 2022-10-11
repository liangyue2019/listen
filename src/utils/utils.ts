import { Key } from 'react';
import { isEmpty } from "lodash"
import { FormInstance, message } from 'antd';
import moment from 'moment';

const USER_INFO_ENV = "user"


export function isArray(object: any) {
    return object && typeof object === 'object' &&
        Array == object.constructor;
}

export const formatObj = (object: Object): any => {
    // console.log(object)
    Object.keys(object).forEach(
        key => {
            const value = object[key]
            const type = typeof value
            // console.log(key, object[key], '=', type)
            if (isEmpty(value) && type !== 'number' && type !== 'boolean' && !isArray(value)) {
                // console.log('if', key)
                object[key] = undefined
            }
        }
    )
    return object
}

export const jsonToString = (object: Object): string => {
    let str
    try {
        const json = formatObj(object)
        str = JSON.stringify(json)
    } catch (error) {
        str = ''
    }
    return str
}

export const stringToJson = (str: string = ''): any => {
    let json
    try {
        json = JSON.parse(str)
    } catch (error) {
        json = {}
    }
    return json
}

export const copyConf = (form: FormInstance) => {
    try {
        const data = form.getFieldsValue(true)
        const str = jsonToString(data)

        const input = document.createElement('input')
        input.setAttribute('readonly', 'readonly')
        input.setAttribute('value', str);
        document.body.appendChild(input)
        input.setSelectionRange(0, 9999)
        input.select()
        document.execCommand('copy')
        document.body.removeChild(input)
        message.success('已复制到剪切板')
    } catch (error) {
        console.log(error)
    }
}

export const pasteConf = async (form: FormInstance) => {
    try {
        const str = await navigator.clipboard.readText()
        const obj = stringToJson(str)
        form.setFieldsValue(obj)
        message.success('粘贴成功')
    } catch (error) {
        console.log(error)
    }
}

export const getValuesByNamepath = (obj: any, name: Array<Key>) => {
    let value = obj
    name.forEach(key => {
        value = value?.[key]
    })
    return value
}

// 获取用户信息
export function getUserInfo() {
    let info;
    info = JSON.parse(localStorage.getItem(USER_INFO_ENV) || '{}');
    return info || {};
}
export function setUserInfo(json: any) {
    const user = getUserInfo()
    localStorage.setItem(
        USER_INFO_ENV,
        JSON.stringify({ ...user, ...json })
    );
};
export function removeUserInfo() {
    localStorage.removeItem(USER_INFO_ENV)
}

// token
export const setToken = (p: { expire: number, token: string }) => {
    const { expire, token } = p
    const expireTime = moment().add(expire, 's').format('YYYY-MM-DDTHH:mm:ss')
    localStorage.setItem(
        'token', 
        JSON.stringify({ token, expireTime })
    )
}
export const getToken = () => {
    let info;
    try {
        info = JSON.parse(localStorage.getItem('token') || '{}')
    } catch(e) {
        console.log(e)
    }
    return info || {};
}
export const setRefreshToken = (p: { refreshToken: string, refreshExpire: number }) => {
    const { refreshToken, refreshExpire } = p
    const expireTime = moment().add(refreshExpire, 's').format('YYYY-MM-DDTHH:mm:ss')
    localStorage.setItem(
        'refreshToken', 
        JSON.stringify({ refreshToken, expireTime })
    )
}
export const getRefreshToken = () => {
    let info;
    try {
        info = JSON.parse(localStorage.getItem('refreshToken') || '{}')
    } catch(e) {
        console.log(e)
    }
    return info || {};
}