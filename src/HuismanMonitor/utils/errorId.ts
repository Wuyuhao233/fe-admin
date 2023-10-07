import { ReportDataType } from '@/HuismanMonitor/types';
import { hash } from 'spark-md5';

const allErrors: Record<string, number> = {};

/**
 * 生成错误的唯一id，解决重复上报的问题
 * @param data
 */
export function createErrorId(data: ReportDataType) {
  let id = `${data.type}_${data.message}_${data.name}`;
  id = hash(id);
  if (allErrors[id]) {
    return null;
  }
  allErrors[id] = 1;
  return id;
}
