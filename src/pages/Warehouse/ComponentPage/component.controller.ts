import { IComponent, IComponentDto } from '@/declare/warehouse';
import { http } from '@/request/http';
class ComponentController {
  getComponentList(params: IComponentDto) {
    return http.get<IComponent[]>('/component/getComponentList', params);
  }
  getComponentById(id: string) {
    return http.get<IComponent>('/component/getComponent', { id });
  }
  deleteComponentById(id: string) {
    return http.delete('/component/deleteComponent', { id });
  }
  updateComponent(component: IComponent) {
    return http.post('/component/updateComponent', component);
  }
  addComponent(component: IComponent) {
    return http.post('/component/addComponent', component);
  }
}
export default new ComponentController();
