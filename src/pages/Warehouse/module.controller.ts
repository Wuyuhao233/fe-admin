import { IModule, IModuleDto } from '@/declare/warehouse';
import { http } from '@/request/http';

class ModuleController {
  getModuleList(params: IModuleDto) {
    return http.get<IModule[]>('/module/getModuleList', params);
  }
}
export default new ModuleController();
