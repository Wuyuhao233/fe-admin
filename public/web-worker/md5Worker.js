self.importScripts('/libs/spark-md5.min.js');
console.log('worker start', self);
self.onmessage = async function (e) {
  try {
    const chunkList = e.data;
    // todo 后续用webWorker来处理
    /**
     * 速度很快，不用开启webWorker -- note 之前onload是回调函数，没有同步执行
     * 所以导致速度快，需要改为同步执行，才能正确算出md5
     * note !!之前使用for循环，没有使用await，这样顺序有可能不对，导致md5不一致
     *
     * todo 计算MD5 CPU使用率很高，需要优化
     */
    const spark = new SparkMD5.ArrayBuffer();
    const length = chunkList.length;
    for (let j = 0; j < length; j++) {
      await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsArrayBuffer(chunkList[j]);
        reader.onload = (e) => {
          console.log(j, e);
          spark.append(e.target.result);
          resolve(e);
        };
      });
    }
    // 整个文件的hash
    const fileHash = spark.end();
    self.postMessage(fileHash);
    self.close();
  } catch (e) {
    console.log('worker error', e);
  }
};
