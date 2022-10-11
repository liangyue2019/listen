import request from "@/services/request"
import { Modal } from "antd"
import { useState } from "react"

export default () => {

    const [res, setRes] = useState('')
    const [visible, setVisible] = useState(false)

    const handleSubmit = async () => {
        const res = await request('http://127.0.0.1:6399/api/v1/heartbeat')
        if(res) {
            let s = ''
            try {
                s = JSON.stringify(res, null, "\t")
            } catch (error) {
                console.log(error)
                s = ''
            }
            setRes(s)
            setVisible(true)
        }
    }

    return (
        <>
            <a onClick={handleSubmit}>click me</a>
            <Modal visible={visible} onCancel={()=>setVisible(false)}>
                <textarea value={res} style={{ minHeight: 360, width: '100%', borderWidth: 0 }} disabled />
            </Modal>
        </>
    )
}