import { UploadOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Card, message, Upload, UploadProps } from 'antd';
import { host } from "@/services/request"
import React from 'react';
import { getToken } from '@/utils/utils';

const Welcome: React.FC = () => {
  const { token } = getToken()
  const props: UploadProps = {
    accept: '.mp3',
    name: 'file',
    action: host + '/audio/upload',
    headers: {
      authorization: token,
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
    <PageContainer>
      <Card>
        <Upload {...props}>
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
      </Card>
    </PageContainer>
  );
};

export default Welcome;
