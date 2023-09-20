import { useUpload } from '@/hooks/useUpload';
import AxiosExe from '@/services/axios';
import { Button, Upload } from 'antd';
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

  async function axiosClick() {
    ref.current = await AxiosExe.get('/auth/testAxios', { log: '9 - 18' });
    console.log('button', ref.current);
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
      </div>
    </>
  );
};
export default Home;
