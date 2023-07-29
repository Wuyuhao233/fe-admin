import { RegisterDTO } from '@/pages/Login/loginController';
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
  getMailCaptcha(email: string) {
    return http.get<string>(`/auth/getMailCaptcha`, { email });
  },
  registerUser(registerInfo: RegisterDTO) {
    return http.post('/auth/register', registerInfo);
  },
};
export default loginService;
