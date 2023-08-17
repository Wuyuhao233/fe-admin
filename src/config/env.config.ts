import * as process from 'process';

export class EnvConfig {
  static getSocketUrl() {
    console.log('env', process.env);
    return process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3303';
  }
}
