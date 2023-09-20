import { User } from '@/declare/User';
import { http } from '@/request/http';

const userService = {
  getUserList<T>(bodyData: any) {
    return http.get<T>('/user/userList', bodyData);
  },
  addUser(bodyData: User) {
    return http.post<string>('/user/addUser', bodyData);
  },
  deleteUser(id: string) {
    return http.delete<string>('/user/deleteUser', { id });
  },
  updateUser(bodyData: User) {
    return http.post<string>('/user/updateUser', bodyData);
  },
};
export default userService;
