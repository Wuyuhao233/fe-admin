import { useUpload } from '@/hooks/useUpload';
import AxiosExe from '@/services/axios';
import { Button, Divider, Upload } from 'antd';
import { UploadProps } from 'antd/es/upload/interface';
import { useRef, useState } from 'react';

const Home = () => {
  const { run } = useUpload();
  const customRequest: UploadProps['customRequest'] = async ({
    file,
    onSuccess,
    onProgress,
  }) => {
    if (file instanceof File) {
      await run({
        data: file,
        fileName: file.name,
        uploadProgress: onProgress,
        onSuccess: onSuccess,
        isMulti: true,
      });
    }
  };
  const [file, setFile] = useState<any>();

  function sendMsg() {
    console.log('sendMsg');
  }
  const ref = useRef<any>(null);
  const a: any = undefined;

  async function axiosClick() {
    ref.current = await AxiosExe.get('/auth/testAxios', { log: '9 - 18' });
    a.b = 1;
  }
  function throwError() {
    a.b = 1;
  }

  async function throwPromiseError() {
    a.b = 2;
    await Promise.reject('promise error');
  }

  return (
    <>
      <Upload
        listType="picture-card"
        customRequest={customRequest}
        onChange={({ fileList }) => {
          console.log('fileList', fileList);
        }}
        maxCount={1}
        onRemove={() => {
          console.log('remove');
          setFile(undefined);
        }}
      >
        {/*当有文件时，不显示上传按钮*/}
        {file ? null : '+'}
      </Upload>
      <Button onClick={sendMsg}>send message</Button>
      <div>
        <Button block={false} size="large" type="primary" onClick={axiosClick}>
          test axios
        </Button>
        <Divider type="vertical" />
        <Button block={false} size="large" type="primary" onClick={throwError}>
          抛出异常
        </Button>
        <Divider type="vertical" />
        <Button
          block={false}
          size="large"
          type="primary"
          onClick={throwPromiseError}
        >
          抛出Promise异常
        </Button>
        <Divider type="vertical" />
        <Button className="text-click-btn">触发点击事件</Button>
      </div>
    </>
  );
};
export default Home;
