import { http } from '@/request/http';
import loginService from '@/services/login';
import { rsaTool } from '@/utils/rsaTool';
export interface LoginDTO {
  autoLogin?: boolean;
  name: string;
  password: string;
  publicKey: string;
}
export interface ResetDTO {
  email: string;
  password: string;
  code: string;
  publicKey: string;
}
export interface RegisterDTO {
  name: string;
  nickName: string;
  email: string;
  phone: string;
  code: string;
  avatar?: string;
  gender: number;
}
class LoginController {
  static instance: LoginController;

  constructor() {
    if (LoginController.instance) {
      return LoginController.instance;
    }
    LoginController.instance = this;
    return this;
  }

  async loginUser(loginInfo: LoginDTO) {
    return await loginService.loginUser(loginInfo);
  }
  async registerUser(registerInfo: RegisterDTO) {
    return await loginService.registerUser(registerInfo);
  }
  // 对密码进行加密
  async getPublicKey(password: string) {
    const { data } = await loginService.getPublicKey();
    const rsaPassword = await rsaTool(password, data);
    return {
      rsaPassword,
      publicKey: data,
    };
  }
  // 获取email验证码
  async getMailCaptcha(email: string) {
    return await loginService.getMailCaptcha(email);
  }
  // 获取重置密码的验证码
  async resetPwdCaptcha(email: string) {
    return await http.get<string>('/auth/resetPwdCaptcha', { email });
  }
  //   重置密码

  async resetPassword(resetInfo: ResetDTO) {
    return http.post('/auth/resetPassword', resetInfo);
  }
}

export default new LoginController();
