/* eslint-disable @typescript-eslint/no-unused-expressions */
import { BreadCrumb } from '@/HuismanMonitor/breadCrumb';
import { MonitorOption } from '@/HuismanMonitor/monitorOption';
import { Subscribe } from '@/HuismanMonitor/subscribe';
import { Transport } from '@/HuismanMonitor/transport';
import { BasePluginType, HuismanMonitorOptions } from '@/HuismanMonitor/types';
import { BreadcrumbPushData } from '@/HuismanMonitor/types/breadCrumbs';
import { BrowserEventTypes, Silent } from '@/HuismanMonitor/utils/constants';
import { firstStr2Uppercase } from '@/HuismanMonitor/utils/helpers';

class HuismanMonitor {
  private options: MonitorOption;
  private transport: Transport;
  private breadcrumb: BreadCrumb;
  constructor(options: HuismanMonitorOptions) {
    // option,transport 需要校验、
    this.options = new MonitorOption(options);
    this.transport = new Transport(options);
    this.breadcrumb = new BreadCrumb();
  }

  /**
   * 判断当前插件是否启用，用于browser的option
   * @param name
   */
  isPluginEnable(name: BrowserEventTypes): boolean {
    // 首字母大写
    const silentField = `${Silent}${firstStr2Uppercase(name)}`;
    return !this.options.hasProperty(silentField);
  }

  /**
   * 使用插件
   * 执行顺序：
   * 1. 校验插件是否启用
   * 2. 执行插件的monitor方法 ：
   *      2.1 monitor方法中on绑定事件
   *      2.2 on绑定的事件触发时，执行notify方法, 通知订阅者
   * 3. 订阅插件的时间名字，并传入回调函数
   *      3.1 回调函数中需要通过transform方法，将事件对象转换为需要的数据格式
   * @param plugins
   */
  use(plugins: BasePluginType[]) {
    console.log('use', plugins);
    if (this.options.disabled) return;
    const subscribe = new Subscribe();
    plugins.forEach((plugin) => {
      if (this.isPluginEnable(plugin.name)) return;
      plugin.monitor(subscribe.notify.bind(subscribe));
      const wrapperTransform = (args: any) => {
        // 转换结果，并消费
        if (plugin.transform) {
          const res = plugin.transform(args);
          // 添加auth信息
          const user = localStorage.getItem('user');
          if (user) {
            const { id, name } = JSON.parse(user);
            res.auth = {
              id,
              name,
            };
          }
          plugin.consumer && plugin.consumer(this, res);
        }
      };
      // 开启订阅
      subscribe.watch(plugin.name, wrapperTransform);
    });
  }
  sendToServer(data: any) {
    this.transport.send(data, this.breadcrumb.getStack());
  }
  pushBreadCrumb(data: BreadcrumbPushData) {
    this.breadcrumb.push(data);
  }
}
export default HuismanMonitor;
