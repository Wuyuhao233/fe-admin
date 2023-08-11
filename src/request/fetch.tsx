import { FlatMenuInfo } from '@/pages/System/controller/menu.controller';
import { buildTree } from '@/utils/tools';
import { createElement } from 'react';
export interface PatchRoutes {
  id: string;
  parentId: string | null;
  path: string;
  name: string;
  element?: React.ReactNode;
  children?: PatchRoutes[];
}
/**
 * 平铺的数据转成树形结构
 * @param menu
 * @param preRoute
 */
export const traverse = (menu: FlatMenuInfo[], preRoute: PatchRoutes[]) => {
  console.log('start...', menu);
  const flatRoutes: PatchRoutes[] = menu.map((item) => {
    const m: PatchRoutes = {
      id: item.id,
      // todo 修改为插入的id
      parentId: item.parentId,
      path: item.parentId === null ? item.route : item.route.substring(1),
      name: item.name,
      // note ./page 是必须这样写的，否则会报错
    };
    if (item.filePath) {
      console.log(
        'see default ',
        typeof require('@/pages' + item.filePath).default,
      );
      // note 使用createElement方法，可以动态加载组件
      m.element = createElement(require('@/pages' + item.filePath).default);
    }
    return m;
  });
  buildTree(flatRoutes);
  console.log(flatRoutes);
  preRoute[preRoute.length - 1]?.children?.push(
    ...flatRoutes.filter((item) => item.parentId === null),
  );
};
