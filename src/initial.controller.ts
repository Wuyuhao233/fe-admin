import { User } from '@/declare/User';
import { http } from '@/request/http';

class InitialController {
  async getCurrUser() {
    return await http.get<User>('/user/currentUser');
  }
}
export default new InitialController();
