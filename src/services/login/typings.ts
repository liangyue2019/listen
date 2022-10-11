
export type LoginDTO = {
    username: string
    password: string
    captchaId: string
    verifyCode: number
}
export declare type LoginInfo = {
    expire: number
    refreshExpire: number
    refreshToken: string
    token: string
    user: UserInfo
}

export declare type UserInfo = {
    headImg: string
    nickName: string
}