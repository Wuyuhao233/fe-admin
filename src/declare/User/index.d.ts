export interface User {
  id: string;
  roles?: Array<string>;
  name?: string;
  openId?: string;
  nickname?: string;
  avatar?: string;
  gender?: number | string;
  phone?: string;
  email?: string;
  createTime: number;
  updateTime: number;
}
