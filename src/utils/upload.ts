import { CHUNCK_SIZE } from '@/config/constants';
import { UploadFileParams } from '@/declare/utils';
import { baseUpload, mergeFile, verifyFile } from '@/request/upload.request';
import SparkMD5 from 'spark-md5';

interface MultiFileUploader {
  SplitFile: (file: File, chunkSize?: number) => Blob[];
}

/**
 * 分割文件,返回一个文件数组
 * @param file
 * @param chunkSize
 */
export const splitFile: MultiFileUploader['SplitFile'] = (
  file,
  chunkSize = CHUNCK_SIZE,
) => {
  const chunks: Blob[] = [];
  const fileSize = file.size;
  let offset = 0;
  while (offset < fileSize) {
    // file.slice 是File继承了Blob对象的方法，用于切割文件
    // bite
    const chunk = file.slice(offset, offset + chunkSize);
    chunks.push(chunk);
    offset += chunkSize;
  }
  return chunks;
};

/**
 * 文件上传，支持分片
 * @param fileName
 * @param data
 * @param uploadProgress
 * @param onSuccess
 * @param isMulti
 */
export const uploadFile = async ({
  fileName,
  data,
  uploadProgress,
  onSuccess,
  isMulti = false,
}: UploadFileParams) => {
  // note 需要去掉后缀
  const fName = encodeURI(fileName);
  const formData = new FormData();
  let res = null;
  formData.set('fileName', fName);
  // 开始时间，测试下需要多久
  const startTime = Date.now();
  // 是否分片
  if (isMulti) {
    // todo 后续用webWorker来处理
    // 速度很快，不用开启webWorker
    const spark = new SparkMD5.ArrayBuffer();
    const chunkList = splitFile(data);
    for (let i = 0; i < chunkList.length; i++) {
      const reader = new FileReader();
      reader.readAsArrayBuffer(chunkList[i]);
      reader.onload = (e: any) => {
        spark.append(e.target.result);
      };
    }

    // 整个文件的hash
    const fileHash = spark.end();
    // 结束时间
    const endTime = Date.now();
    console.log('md5计算时间', fileHash, endTime - startTime);
    // note 秒传的实现
    res = await verifyFile(fileHash, fName);
    if (res.code === 304) {
      uploadProgress?.({
        percent: 100,
      });
      onSuccess?.(res?.data);
      return res;
    }
    formData.set('hash', fileHash);
    // note 断点续传的实现
    let chunkList1: Blob[] = [];
    const put = res.data;
    if (Array.isArray(put)) {
      chunkList1 = chunkList.filter((item, index) => {
        return !put.includes(index);
      });
    }
    console.log('chunkList1', chunkList1, put);
    // 将这个任务放入webWorker中
    for (let i = 0; i < chunkList1.length; i++) {
      const chunk = chunkList1[i];
      formData.set('chunkIndex', String(i));
      formData.set('type', 'multi');
      formData.set('chunk', chunk);
      formData.set('hash', fileHash);
      await baseUpload(formData, {
        onUploadProgress: () => {
          uploadProgress?.({
            percent: Number((i / chunkList1.length).toFixed(2)) * 100,
          });
        },
      });
    }
    //   发起合并请求
    res = await mergeFile(fileHash, fName, {
      contentType: data.type
        ? 'application/' + data.type
        : 'application/octet-stream',
    });
    //   note 合并是很耗时的，所以需要去轮询
  } else {
    formData.set('data', data);
    res = await baseUpload(formData, {
      onUploadProgress: ({ total, loaded }) => {
        console.log('uploading...', loaded, total);
        uploadProgress?.({
          percent: Number((loaded / total).toFixed(2)) * 100,
        });
      },
    });
  }

  // note 需要在这里调用下，否则上传多个文件，只会触发最后一个文件的onSuccess
  // note 将返回的data传递给onSuccess，这样就可以在fileList中的response中获取到data
  onSuccess?.(res?.data);
  return res;
};
