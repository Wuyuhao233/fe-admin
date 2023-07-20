import { PageInfo } from '@/services/type';
import userService from '@/services/user';
export interface UserInfo {
  id: number;
  roles?: Array<string>;
  name?: string;
  openId?: string;
  nickname?: string;
  avatar?: string;
  gender?: number;
  phone?: string;
  email?: string;
  createTime: number;
  updateTime: number;
}
class UserController {
  static instance: UserController;

  constructor() {
    if (UserController.instance) {
      return UserController.instance;
    }
    UserController.instance = this;
    return this;
  }

  async addUser(user: UserInfo) {
    return await userService.addUser(user);
  }

  async queryUserList(pageInfo: PageInfo) {
    return await userService.getUserList<UserInfo[]>(pageInfo);
  }

  async deleteUser(id: number | string) {
    return await userService.deleteUser(Number(id));
  }

  async modifyUser(user: UserInfo) {
    return await userService.updateUser(user);
  }
}

export default new UserController();
