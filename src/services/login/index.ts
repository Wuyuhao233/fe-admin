import { http } from '@/request/http';
interface Token {
  access_token: string;
  refresh_token: string;
}
const loginService = {
  loginUser(data: any) {
    return http.post<Token>('/auth/login', data);
  },
  getPublicKey() {
    return http.get<string>('/auth/publicKey');
  },
};
export default loginService;
