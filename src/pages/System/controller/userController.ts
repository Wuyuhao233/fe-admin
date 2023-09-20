import { User } from '@/declare/User';
import { PageInfo } from '@/services/type';
import userService from '@/services/user';
class UserController {
  static instance: UserController;

  constructor() {
    if (UserController.instance) {
      return UserController.instance;
    }
    UserController.instance = this;
    return this;
  }

  async queryUserList(pageInfo: PageInfo) {
    return await userService.getUserList<User[]>(pageInfo);
  }

  async deleteUser(id: string) {
    return await userService.deleteUser(id);
  }

  async modifyUser(user: User) {
    return await userService.updateUser(user);
  }
}

export default new UserController();
