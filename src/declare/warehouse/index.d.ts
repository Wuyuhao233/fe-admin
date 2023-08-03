import { IBase, IBaseDto } from '@/declare';

export interface IComponent extends IBase {
  name: string;
  description: string;
  weight: number;
  high: number;
  width: number;
  length: number;
  status: number;
  attachment: IFile[];
  module: IModule;
  series: ISeries;
}
export interface IComponentDto extends IBaseDto {
  name?: string;
}
export interface IFile extends IBase {
  fileName: string;
  filePath: string;
  pkName: string;
  pkValue: string;
}

/***   模块   */
export interface IModule extends IBase {
  name: string;
  description: string;
}
export interface IModuleDto extends IBaseDto {
  name?: string;
  description?: string;
}
/**    类别     */
export interface ISeries extends IBase {
  name: string;
  module: IModule | null;
  //方便进行编辑
  moduleId?: string;
}
export interface ISeriesDto extends IBaseDto {
  name?: string;
  description?: string;
}
