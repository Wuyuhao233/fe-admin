import { IBase } from '@/declare';
import { http } from '@/request/http';
export interface IFunction extends IBase {
  name: string;
  parentId: string;
  level: number;
  description: string;
  children?: IFunction[];
  key: string;
}
export const functionController = {
  async getLevel1() {
    return await http.get<IFunction[]>('/function/getLevel1');
  },
  async getListById(id: string) {
    return await http.get<IFunction[]>('/function/getListById', { id });
  },
  async addFunction(params: Partial<IFunction>) {
    return await http.post<string>('/function/addFunction', params);
  },
  async getFunctionTree() {
    return await http.get<IFunction[]>('/function/getFunctionTree');
  },
};
