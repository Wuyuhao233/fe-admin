import { IBase, IBaseDto } from '@/declare';
import { http } from '@/request/http';
export interface MenuInfo extends IBase {
  parentId: string | null;
  name: string;
  type: number | string;
  hasChild?: boolean;
  children: MenuInfo[];
  route: string;
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

  async queryMenuList(pageInfo: IBaseDto) {
    return await http.get<MenuInfo[]>('/menu/menuList', pageInfo);
  }
  async getChildMenuList(id: string) {
    return await http.get<MenuInfo[]>('/menu/getChildMenu', { id });
  }
  async getMenuInfo(id: string) {
    return await http.get<MenuInfo>('/menu/getMenuInfo', { id });
  }
  async deleteMenu(id: number | string) {
    return await http.delete('/menu/deleteMenu', { id });
  }

  async modifyMenu(menu: MenuDto) {
    return await http.post('/menu/updateMenu', menu);
  }
  async addMenu(menu: MenuDto) {
    return await http.post('/menu/addMenu', menu);
  }
}

export default new MenuController();
