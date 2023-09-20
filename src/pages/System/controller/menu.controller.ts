import { IBase, IBaseDto } from '@/declare';
import { http } from '@/request/http';
export interface MenuInfo extends IBase {
  parentId: string | null;
  name: string;
  type: number | string;
  hasChild?: boolean;
  children: MenuInfo[];
  route: string;
  key: string;
}

export interface FlatMenuInfo extends IBase {
  parentId: string | null;
  name: string;
  type: number | string;
  filePath?: string;
  route: string;
  icon?: string;
}
export interface MenuDto {
  id?: string;
  parentId: string | null;
  name: string;
  icon?: string;
  type: number;
  route?: string;
  filePath?: string;
  orderNumber?: number;
  url?: string;
  show?: boolean;
  apis?: any[];
}
export interface IApis {
  moduleName: string;
  children: {
    path: string;
    method: string;
  }[];
}
export class MenuController {
  static instance: MenuController;

  constructor() {
    if (MenuController.instance) {
      return MenuController.instance;
    }
    MenuController.instance = this;
    return this;
  }

  /**
   * 获取菜单列表,一级菜单
   * @param pageInfo
   */
  async queryMenuList(pageInfo: IBaseDto) {
    return await http.get<MenuInfo[]>('/menu/menuList', pageInfo);
  }

  /**
   * 获取父节点下的所有子节点，不是树形结构
   * @param id
   */
  async getChildMenuList(id: string) {
    return await http.get<MenuInfo[]>('/menu/getChildMenu', { id });
  }

  /**
   * 获取菜单详情
   * @param id
   */
  async getMenuInfo(id: string) {
    return await http.get<MenuInfo>('/menu/getMenuInfo', { id });
  }

  /**
   * 删除菜单
   * @param id
   */
  async deleteMenu(id: number | string) {
    return await http.delete('/menu/deleteMenu', { id });
  }

  /**
   * 修改菜单
   * @param menu
   */
  async modifyMenu(menu: MenuDto) {
    return await http.post('/menu/updateMenu', menu);
  }

  /**
   * 添加菜单
   * @param menu
   */
  async addMenu(menu: MenuDto) {
    return await http.post('/menu/addMenu', menu);
  }

  /**
   * 获取所有的菜单，树形结构
   */
  async getMenuTree() {
    return await http.get<MenuInfo[]>('/menu/getMenuTree');
  }

  async getApis() {
    return await http.get<IApis[]>('/menu/allRoutes');
  }
}

export default new MenuController();
