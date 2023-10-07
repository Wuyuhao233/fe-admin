import {
  BasePluginType,
  ReportDataType,
  Severity,
} from '@/HuismanMonitor/types';
import {
  BREADCRUMBCATEGORYS,
  BreadcrumbPushData,
  BreadcrumbTypes,
} from '@/HuismanMonitor/types/breadCrumbs';
import { BrowserEventTypes } from '@/HuismanMonitor/utils/constants';
import { getLocationHref, on } from '@/HuismanMonitor/utils/helpers';
import { throttle } from 'lodash';

const domClickPlugin: BasePluginType = {
  name: BrowserEventTypes.DOM,
  monitor(notify) {
    console.log('domClickPlugin -- monitor');
    if (!document) return;
    const throttleNotify = throttle(notify, 1000);
    on(document, 'click', (e: PointerEvent) => {
      console.log('domClickPlugin -- notify', e);
      const target = e.target as HTMLElement;
      if (target.innerText) {
        throttleNotify(BrowserEventTypes.DOM, target);
      }
    });
  },
  transform(e: HTMLElement) {
    const classNames = e.className ? `class="${e.className}"` : '';
    const id = e.id ? `id="${e.id}"` : '';
    const result: ReportDataType = {
      level: Severity.Info,
      name: 'domClick',
      time: Date.now(),
      type: 'click',
      url: getLocationHref(),
      message: `<${e.localName}${id} ${classNames !== '' ? classNames : ''}>${
        e.innerText
      }</${e.localName}>`,
    };
    return result;
  },
  consumer(monitor, data: MouseEvent) {
    // 压入堆栈
    const breadCrumbData: BreadcrumbPushData = {
      type: BreadcrumbTypes.CLICK,
      level: 'normal',
      time: Date.now(),
      category: BREADCRUMBCATEGORYS.USER,
    };
    monitor.pushBreadCrumb(breadCrumbData);
    console.log('消费数据--用于上报', data);
    monitor.sendToServer(data);
  },
};
export default domClickPlugin;
