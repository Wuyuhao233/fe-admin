export interface IBase {
  createTime: string;
  updateTime: string;
  id: string;
}

export interface IBaseDto {
  pageSize: number;
  current: number;
}
