import MenuController, {
  MenuInfo,
} from '@/pages/System/controller/menu.controller';
import { useRequest } from '@@/exports';
import { message, Modal, Tree } from 'antd';
import { isArray } from 'lodash';
import { useEffect, useState } from 'react';
const { getMenuTree } = MenuController;
// types
type TreeProps = React.ComponentProps<typeof Tree>;
interface TreeModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  onChange?: (e: any) => void;
  value?: any;
}
const TreeModal = ({
  visible,
  setVisible,
  onChange,
  value,
}: TreeModalProps) => {
  const [treeData, setTreeData] = useState<MenuInfo[]>([]);
  const [checkKeys, setCheckKeys] = useState<React.Key[]>([]);
  useRequest(getMenuTree, {
    onSuccess: (data) => {
      if (data.code === 200) {
        setTreeData(data.data);
      } else {
        setTreeData([]);
        message.error(data.msg);
      }
    },
  });
  useEffect(() => {
    if (isArray(value)) {
      // 给的是平铺的菜单
      setCheckKeys(value.map((item) => item.id));
    }
  }, [value]);
  useEffect(() => {
    if (isArray(value)) {
      // note 如果没有任何操作，直接将value将会是menus，而不是id
      // 所以在这直接转换
      if (typeof value[0] === 'object') {
        setCheckKeys(value.map((item) => item.id));
      }
    }
  }, []);
  const onCheck: TreeProps['onCheck'] = (checkedKeys, info) => {
    console.log('onCheck', checkedKeys, info);
    if (isArray(checkedKeys)) {
      setCheckKeys(checkedKeys);
    }
  };

  function onOk() {
    onChange?.(checkKeys);
    setVisible(false);
  }

  return (
    <>
      <Modal
        mask={true}
        closable={true}
        maskClosable={true}
        onCancel={() => setVisible(false)}
        onOk={onOk}
        title={'分配菜单'}
        open={visible}
        destroyOnClose={true}
      >
        <Tree
          multiple={true}
          fieldNames={{ children: 'children', title: 'name', key: 'id' }}
          treeData={treeData}
          checkable={true}
          checkedKeys={checkKeys}
          onCheck={onCheck}
        />
      </Modal>
    </>
  );
};
export default TreeModal;
