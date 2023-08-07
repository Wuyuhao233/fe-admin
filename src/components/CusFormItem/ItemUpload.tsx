import { useUpload } from '@/hooks/useUpload';
import { Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import { UploadProps } from 'antd/es/upload/interface';
import { CSSProperties, useState } from 'react';
export interface FormItemProps {
  id?: string;
  onBlur?: () => void;
  onChange?: (e: any) => void;
  style?: CSSProperties;
  value?: any;
}

/**
 *
 * @param onChange 用于修改表单值，传递给表单的值
 * @param rest
 * @constructor
 */
const ItemUpload = ({ onChange, ...rest }: FormItemProps) => {
  console.log('prop', rest);
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
      });
    }
  };
  const [file, setFile] = useState<any>();
  return (
    <ImgCrop>
      <Upload
        listType="picture-card"
        customRequest={customRequest}
        onChange={({ fileList }) => {
          // note 使用fileList[0]，而不是file，因为fileList 会被remove处理，而file不会
          setFile(fileList[0]);
          // note 将文件id传递给表单
          onChange?.(fileList[0]?.response?.id);
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
    </ImgCrop>
  );
};
// <ImgCrop showGrid rotationSlider showReset>
//   <Upload
//     listType={'picture-card'}
//     multiple={true}
//     customRequest={customRequest}
//     maxCount={1}
//     // beforeUpload={beforeUpload}
//     progress={{
//       strokeColor: {
//         '0%': '#108ee9',
//         '100%': '#87d068',
//       },
//       strokeWidth: 3,
//       format: (percent) =>
//         `${parseFloat((percent || 0).toFixed(2))}%`,
//     }}
//   >
//     <PlusOutlined style={{ fontSize: '24px' }} />
//   </Upload>
// </ImgCrop>
export default ItemUpload;
