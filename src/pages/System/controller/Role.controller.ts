import { IBase, IBaseDto } from '@/declare';
import { FlatMenuInfo } from '@/pages/System/controller/menu.controller';
import { http } from '@/request/http';
export interface RoleInfo extends IBase {
  name: string;
  title: string;
  menus?: FlatMenuInfo[] | string[];
  menuIds?: string[];
}
type RoleDto = IBaseDto;
class RoleController {
  getRoleList(params?: RoleDto) {
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
