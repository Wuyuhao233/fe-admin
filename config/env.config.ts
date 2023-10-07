import * as process from 'process';

export class EnvConfig {
  static getSocketUrl() {
    console.log('env', process.env);
    return process.env.NODE_ENV === 'development'
      ? 'http://localhost:3303'
      : 'http://42.193.237.23:3303';
  }

  static getFetchUrl() {
    return process.env.NODE_ENV === 'development'
      ? 'http://localhost:3333/api/v1/menu/getCurUserMenu'
      : // note 这里不加ff，不用反向代理
        'http://42.193.237.23:3333/api/v1/menu/getCurUserMenu';
  }
  static getRefreshTokenUrl() {
    return process.env.NODE_ENV === 'development'
      ? 'http://localhost:3333/api/v1/auth/refreshToken'
      : 'http://42.193.237.23:3333/api/v1/auth/refreshToken';
  }
}
