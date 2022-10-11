import React, { useEffect } from 'react';
import { Input } from 'antd';
const KeyInput: React.FC<{ imgKey: string, onChange?: (v: any) => void }> = (props) => {
    const { imgKey, onChange } = props
    useEffect(() => {
        onChange?.(imgKey)
    }, [imgKey])

    return (
        <Input value={imgKey} />
    )
}
export default KeyInput