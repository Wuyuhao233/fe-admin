import { nativeTryCatch } from '@/HuismanMonitor/utils/helpers';

type CallBackType = (...args: any[]) => any;
/**
 * 发布订阅模式
 */
export class Subscribe<T> {
  /**
   * 订阅
   */
  dep: Map<T, CallBackType[]> = new Map();

  /**
   * 监听
   * 将事件和回调函数放入dep中
   * @param eventName
   * @param callBack
   */
  watch(eventName: T, callBack: CallBackType) {
    const name = this.dep.get(eventName);
    if (name) {
      this.dep.set(eventName, [...name, callBack]);
    } else {
      this.dep.set(eventName, [callBack]);
    }
    console.log(eventName, '--', this.dep.get(eventName), '开启监听');
  }

  /**
   * 通知
   * @param eventName
   * @param data
   */
  notify<D = any>(eventName: T, data: D) {
    const callBacks = this.dep.get(eventName);
    if (callBacks) {
      // 执行对应的回调函数
      callBacks.forEach((callBack) => {
        nativeTryCatch(
          () => {
            console.log(eventName, '--,通知', callBack);
            callBack(data);
          },
          (error) => {
            console.error(`[HuismanMonitor] ${eventName} error:`, error);
          },
        );
      });
    }
  }
}
