import { useUpload } from '@/hooks/useUpload';
import { Button, Upload } from 'antd';
import { UploadProps } from 'antd/es/upload/interface';
import { useState } from 'react';

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
    </>
  );
};
export default Home;
