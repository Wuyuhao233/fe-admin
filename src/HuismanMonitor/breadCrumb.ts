import { BreadcrumbPushData } from '@/HuismanMonitor/types/breadCrumbs';

export class BreadCrumb {
  private maxBreadCrumbs: number = 10;
  private stack: BreadcrumbPushData[] = [];
  push(data: BreadcrumbPushData) {
    if (this.stack.length >= this.maxBreadCrumbs) {
      this.stack.shift();
    }
    if (!data.time) {
      data.time = Date.now();
    }
    this.stack.push(data);
    // 按时间排序
    this.stack.sort((a, b) => a.time - b.time);
    return this.stack;
  }
  getStack() {
    return this.stack;
  }
}
