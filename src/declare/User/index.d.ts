import { RoleInfo } from '@/pages/System/controller/Role.controller';

export interface User {
  id: string;
  roles?: RoleInfo[] | string[];
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
