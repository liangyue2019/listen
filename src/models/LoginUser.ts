import { useEffect, useState } from "react"
import { getRefreshToken, getToken, setToken } from "@/utils/utils"
import moment from "moment"
import { fetchRefreshToken, fetchUserInfo } from "@/services/login"
import { isEmpty } from "lodash"

export default () => {
    const [user, setUser] = useState<any>({})

    useEffect(() => {
        if(isEmpty(user)) {
            fetchUser()
        }
    }, [])

    const fetchUser = async() => {
        const boolean = await validateToken()
        if(boolean) {
            const data = await fetchUserInfo()
            setUser(data)
        } else {
            
        }
    }

    const validateToken = async(): Promise<boolean> => {
        const { expireTime, token } = getToken()
        if(token) {
            const duration = moment(expireTime).diff(moment(), 's')
            console.log('duration:', duration)
            if(duration > 600) {
                return true
            } else {
                return runRefreshToken()
            }
        } else {
            return false
        }
    }

    const runRefreshToken = async(): Promise<boolean> => {
        const { refreshToken, expireTime } = getRefreshToken()
        const duration = moment(expireTime).diff(moment(), 's')
        if(duration > 600) {
            const res = await fetchRefreshToken(refreshToken)
            const { token, expire } = res.data
            if(token && expire) {
                setToken({ token, expire })
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    }

    return {
        user, 
        setUser
    }
}