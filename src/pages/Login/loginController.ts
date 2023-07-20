import loginService from '@/services/login';
import { rsaTool } from '@/utils/rsaTool';

interface LoginForm {
  autoLogin: boolean;
  captcha?: string;
  mobile?: string;
  password?: string;
  name?: string;
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

  async loginUser(loginInfo: LoginForm) {
    const { autoLogin, captcha, mobile, name } = loginInfo;
    if (name && loginInfo.password) {
      const { rsaPassword, publicKey } =
        await LoginController.instance.getPublicKey(loginInfo.password);
      return await loginService.loginUser({
        name,
        password: rsaPassword,
        publicKey,
        autoLogin,
      });
    }

    return await loginService.loginUser({
      mobile,
      captcha,
      autoLogin,
    });
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
}

export default new LoginController();
