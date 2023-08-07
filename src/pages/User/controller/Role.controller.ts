import { BaseInfo, IBaseDto } from '@/declare';
import { http } from '@/request/http';
export interface RoleInfo extends BaseInfo {
  name: string;
  title: string;
}
type RoleDto = IBaseDto;
class RoleController {
  getRoleList(params: RoleDto) {
    return http.get<RoleInfo[]>('/role/getRoleList', params);
  }
  getRoleById(id: string) {
    return http.get<RoleInfo>('/role/getRole', { id });
  }
  deleteRoleById(id: string) {
    return http.delete('/role/deleteRole', { id });
  }
  updateRole(role: RoleInfo) {
    return http.post('/role/updateRole', role);
  }
  addRole(role: RoleInfo) {
    return http.post('/role/addRole', role);
  }
}
export default new RoleController();
