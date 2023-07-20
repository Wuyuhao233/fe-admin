import { UserInfo } from '@/pages/Table/userController';
import { http } from '@/request/http';

const userService = {
  getUserList<T>(bodyData: any) {
    return http.get<T>('/user/userList', bodyData);
  },
  addUser(bodyData: UserInfo) {
    return http.post<string>('/user/addUser', bodyData);
  },
  deleteUser(id: number) {
    return http.delete<string>('/user/deleteUser', { id });
  },
  updateUser(bodyData: UserInfo) {
    return http.post<string>('/user/updateUser', bodyData);
  },
};
export default userService;
