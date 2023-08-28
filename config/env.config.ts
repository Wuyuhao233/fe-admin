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
      : 'http://42.193.237.23:3333/api/v1/menu/getCurUserMenu';
  }
}
