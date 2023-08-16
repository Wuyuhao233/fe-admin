import { CHUNCK_SIZE } from '@/config/constants';
import { UploadFileParams } from '@/declare/utils';
import { baseUpload, mergeFile, verifyFile } from '@/request/upload.request';
export interface WorkerExport {
  fileHash: string;
  chunkList: Blob[];
}
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
 * note 目前存在视频hash值不一致的问题，需要解决
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
  console.log('uploadFile', fileName, data);
  // note 需要去掉后缀
  const fName = encodeURI(fileName);
  const formData = new FormData();
  let res = null;
  formData.set('fileName', fName);
  // 开始时间，测试下需要多久
  const startTime = Date.now();
  // 是否分片
  if (isMulti) {
    let fileHash = '';
    let chunkList = splitFile(data);
    // 开启web-worker
    await new Promise((resolve) => {
      console.log('web-worker start...');
      const worker = new Worker('/web-worker/md5Worker.js');
      worker.postMessage(chunkList);
      worker.onmessage = function (e: MessageEvent<string>) {
        console.log('onmessage', e.data);
        fileHash = e.data;
        resolve(e);
      };
      console.log('worker', worker);
      worker.onerror = function (e) {
        console.log('web-worker error', e);
      };
    });
    // 结束时间
    const endTime = Date.now();
    // note 70mb -0.8s ,900 - 10s,差不多100mb/s，但是电脑较差时，会有卡顿
    //
    console.log('md5计算时间', fileHash, (endTime - startTime) / 1000, 's');
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
    //todo 将这个任务放入webWorker中
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
