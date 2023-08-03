import { http } from '@/request/http';

const common = {
  updaload(data: any) {
    return http.post('/file/upload', data);
  },
};
export default common;
