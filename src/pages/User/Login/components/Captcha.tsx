import React, { useEffect, useState } from 'react';
import {
    MailOutlined
} from '@ant-design/icons';
import { ProFormText } from '@ant-design/pro-form';
import { Spin, Row, Col, Input, Form } from 'antd';
import { useRequest } from 'ahooks';
import styles from '../index.less';
import { captcha } from '@/services/login';
import KeyInput from './KeyInput';

const Captcha: React.FC = () => {

    const initialData = { captchaId: '', data: '' }
    const { data = initialData, loading, run: fetchImg } = useRequest(
        captcha,
    )

    // console.log('data', data)


    return (
        <Row justify='space-around' gutter={8}>
            <Col span={15}>
                <ProFormText
                    fieldProps={{
                        size: 'large',
                        prefix: <MailOutlined className={styles.prefixIcon} />,
                    }}
                    name="verifyCode"
                    placeholder={'验证码(不区分大小写)'}
                    width='sm'
                />
            </Col>
            <Col span={9}>
                <Spin spinning={loading}>
                    <a onClick={fetchImg}>
                        <img width='100%' height="39.8px" src={data.data} alt="图片加载失败" />
                    </a>
                </Spin>
            </Col>
            <Form.Item name={'captchaId'} style={{ display: 'none' }}>
                <KeyInput imgKey={data.captchaId} />
            </Form.Item>
        </Row>
    )
}
export default Captcha