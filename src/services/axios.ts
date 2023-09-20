import { AxiosConfig } from '@/request/AxiosConfig';
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8000/ff/api/v1',
  timeout: 5000,
});
class AAA {
  static queue: any[] = [];
  static isRefreshing = false;
  static async refreshToken() {
    if (AAA.isRefreshing) return;
    AAA.isRefreshing = true;
    instance
      .get('/auth/axiosRefresh')
      .then(() => {
        AxiosConfig.isRefreshing = false;
        Array(AAA.queue.length)
          .fill(0)
          .forEach(() => {
            const req = AAA.queue.shift();
            if (req) {
              const { config, resolve, type } = req;
              console.log('resend...', req);
              if (type === 'response') {
                instance.request(config as any).then((res: any) => {
                  console.log('resolve...', res);
                  resolve(res);
                });
              }
              if (type === 'request' && config.headers) {
                config.headers.Authorization = `Bearer ${localStorage.getItem(
                  'access_token',
                )}`;
                resolve(config);
              }
            }
          });
      })
      .finally(() => {
        AAA.isRefreshing = false;
      });
  }
}
const AxiosExe = {
  get(url: string, params?: any) {
    return new Promise((resolve, reject) => {
      instance
        .get(url, { params })
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          const code = err?.response?.status;
          if (code === 401) {
            console.log('401', err);
            // return new Promise(() => {
            //   setTimeout(() => {
            //     resolve('this is catch rrrr');
            //   }, 2000);
            // });
            return new Promise(() => {
              AAA.queue.push({
                resolve,
                config: err.response.config,
                type: 'response',
              });
              if (!AAA.isRefreshing) {
                AAA.refreshToken();
              }
            });
          }
          console.log('promise catch', err);
          reject(err);
        });
    });
  },
};
export default AxiosExe;
