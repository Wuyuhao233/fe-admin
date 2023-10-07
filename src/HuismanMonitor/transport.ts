import { HuismanMonitorOptions, ReportDataType } from '@/HuismanMonitor/types';
import { Queue } from '@/HuismanMonitor/utils/Queue';
import { ToStringTypes } from '@/HuismanMonitor/utils/constants';
import { createErrorId } from '@/HuismanMonitor/utils/errorId';
import { validateOptionsAndSet } from '@/HuismanMonitor/utils/helpers';
export class Transport {
  queue: Queue;
  [key: string]: any;
  constructor(options: HuismanMonitorOptions) {
    this.bindOptions(options);
    this.queue = new Queue();
  }

  /**
   * 绑定配置项，主要是校验是否启用图片上传
   * @param options
   */
  bindOptions(options: HuismanMonitorOptions) {
    const { useImgUpload = true, dsn } = options;
    validateOptionsAndSet(this, [
      [useImgUpload, 'useImgUpload', ToStringTypes.Boolean],
      [dsn, 'dsn', ToStringTypes.String],
    ]);
  }

  /**
   * 发送数据，通过图片上传的方式
   * data 包括了breadcrumb
   * @param data
   * @param breadcrumb
   */
  async send(data: ReportDataType, breadcrumb: any) {
    if (!this.useImgUpload) return;
    if (['error', 'unhandledrejection'].includes(data.type)) {
      const errorId = createErrorId(data);
      if (!errorId) return;
      data.errorId = errorId;
    }
    const { id, name } = JSON.parse(localStorage.getItem('userInfo') || '{}');
    data.userId = id;
    data.userName = name;
    const { dsn } = this;
    let image: HTMLImageElement | null = new Image();
    // todo 解决data存在循环引用的问题
    const reportData = JSON.stringify(data);
    const reportBreadcrumb = JSON.stringify(breadcrumb);
    image.src = `${dsn}?data=${encodeURIComponent(
      reportData,
    )}&breadcrumb=${encodeURIComponent(reportBreadcrumb)}`;
    console.log('send', reportData, reportBreadcrumb);

    image = null;
  }
}
