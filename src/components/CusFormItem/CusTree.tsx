import { FormItemProps } from '@/components/CusFormItem/ItemUpload';
import MenuController from '@/pages/System/controller/menu.controller';
import { useRequest } from '@umijs/max';
import { TreeSelect } from 'antd';
import { useState } from 'react';
const CusTree = ({ onChange, value }: FormItemProps<any>) => {
  const [treeData, setTreeData] = useState<any[]>([]);
  const { getApis } = MenuController;
  useRequest(getApis, {
    onSuccess(data: any) {
      function modifyTree(node: any) {
        node.value = node.method + '~' + node.title;
        return node;
      }
      data.data.forEach((item: any) => {
        if (item.children) {
          item.children = item.children.map((ic: any) => {
            return modifyTree(ic);
          });
        }
        modifyTree(item);
      });
      setTreeData(data.data);
    },
  });
  console.log('CusTree', value, treeData);
  const onTreeChange = (value: any) => {
    onChange?.(value);
  };
  return (
    <TreeSelect
      onChange={onTreeChange}
      treeData={treeData}
      treeCheckable={true}
      // fieldNames={{ label: 'title', value: 'title', children: 'children' }}
    />
  );
};
export default CusTree;
