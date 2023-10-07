import { ToStringTypes } from '@/HuismanMonitor/utils/constants';
export const nativeToString = Object.prototype.toString;
/**
 * Checks whether given value's type is an instance of provided constructor.
 * {../link isInstanceOf}.
 *
 * ../param wat A value to be checked.
 * ../param base A constructor to be used in a check.
 * ../returns A boolean representing the result.
 */
export function isInstanceOf(wat: any, base: any): boolean {
  try {
    // tslint:disable-next-line:no-unsafe-any
    return wat instanceof base;
  } catch (_e) {
    return false;
  }
}
/**
 * 校验配置项并设置
 * @param targetObj
 * @param validateArr
 */
export const validateOptionsAndSet = (
  targetObj: any,
  validateArr: [any, string, ToStringTypes][],
) => {
  validateArr.forEach((item) => {
    const [v, name, type] = item;
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    if (typeof v !== 'undefined' && firstStr2Uppercase(typeof v) !== type) {
      console.error(`${name}期望传入:${type}类型，当前是:${typeof v}类型`);
    } else {
      targetObj[name] = v;
    }
  });
};
/**
 * 首字母大写
 */
export const firstStr2Uppercase = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
type TotalEventName =
  | keyof WindowEventMap
  | keyof GlobalEventHandlersEventMap
  | keyof XMLHttpRequestEventTargetEventMap;

/**
 * 事件绑定,todo 兼容IE
 * @param target
 * @param eventName
 * @param callBack
 * @param option
 */
export function on(
  target: { addEventListener: (...args: any[]) => any },
  eventName: TotalEventName,
  callBack: (...args: any[]) => any,
  option: boolean = false,
) {
  console.log('绑定事件', eventName);
  target.addEventListener(eventName, callBack, option);
}

/**
 * try catch 封装
 * @param fn
 * @param errorFn
 */
export function nativeTryCatch(fn: () => void, errorFn: (error: any) => void) {
  try {
    fn();
  } catch (error) {
    errorFn(error);
  }
}
/**
 * Checks whether given value's type is one of a few Error or Error-like
 * {../link isError}.
 *
 * ../param wat A value to be checked.
 * ../returns A boolean representing the result.
 */
export function isError(wat: any): boolean {
  switch (nativeToString.call(wat)) {
    case '[object Error]':
      return true;
    case '[object Exception]':
      return true;
    case '[object DOMException]':
      return true;
    default:
      return isInstanceOf(wat, Error);
  }
}
export const getLocationHref = () => {
  if (typeof document === 'undefined' || !document.location) return '';
  return document.location.href;
};
export const getUserInfo = () => {
  try {
    const userStr = localStorage.getItem('user');
    const user = JSON.parse(userStr || '{}');
    return {
      userId: user.id,
      userName: user.name,
    };
  } catch (e) {
    return {};
  }
};
/**
 * 替换原有的方法
 * @param target
 * @param name
 * @param newFn ：以原有的函数为参数，返回一个新的函数
 * @param force
 */
export const replaceOld = (
  target: any,
  name: string,
  newFn: (...args: any[]) => any,
  force = false,
) => {
  if (!target) return;
  if (name in target || force) {
    const nativeFn = target[name];
    const wrappedFn = newFn(nativeFn);
    if (typeof wrappedFn === 'function') {
      target[name] = wrappedFn;
    }
  }
};
