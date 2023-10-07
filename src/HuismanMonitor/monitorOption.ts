import { HuismanMonitorOptions } from '@/HuismanMonitor/types';
import { ToStringTypes } from '@/HuismanMonitor/utils/constants';
import { validateOptionsAndSet } from '@/HuismanMonitor/utils/helpers';

/**
 * 监控配置项
 * @param {HuismanMonitorOptions} options
 * @export MonitorOption
 * @class MonitorOption
 * @example
 * const monitorOption = new MonitorOption({
 *  dsn: 'http://localhost:3000/api/error',
 *  appkey: 'test',
 *  plugins: [],
 *  autoReport: true,
 *  delay: 2000,
 *  random: 1,
 *  repeat: 5,
 *  )};
 */
export class MonitorOption {
  [key: string]: any;
  constructor(options: HuismanMonitorOptions) {
    this.bindOptions(options);
  }
  bindOptions(options: HuismanMonitorOptions) {
    const {
      silentXhr,
      silentFetch,
      silentConsole,
      silentDom,
      silentHistory,
      silentError,
      silentHashchange,
      silentUnhandledrejection,
      silentPerformance,
      useImgUpload,
      configReportXhr,
    } = options;
    const booleanType = ToStringTypes.Boolean;
    const optionArr: [any, string, ToStringTypes][] = [
      [silentXhr, 'silentXhr', booleanType],
      [silentFetch, 'silentFetch', booleanType],
      [silentConsole, 'silentConsole', booleanType],
      [silentDom, 'silentDom', booleanType],
      [silentHistory, 'silentHistory', booleanType],
      [silentError, 'silentError', booleanType],
      [silentHashchange, 'silentHashchange', booleanType],
      [silentUnhandledrejection, 'silentUnhandledrejection', booleanType],
      [useImgUpload, 'useImgUpload', booleanType],
      [configReportXhr, 'configReportXhr', ToStringTypes.Function],
      [silentPerformance, 'silentPerformance', booleanType],
    ];
    validateOptionsAndSet(this, optionArr);
  }
  hasProperty(p: string) {
    return this.hasOwnProperty(p);
  }
}
