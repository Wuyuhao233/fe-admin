import {
  functionController,
  IFunction,
} from '@/pages/System/controller/function.controller';
import { useRequest } from '@@/exports';
import { message, Modal, Tree } from 'antd';
import { isArray } from 'lodash';
import { useEffect, useState } from 'react';
const { getFunctionTree } = functionController;
// types
type TreeProps = React.ComponentProps<typeof Tree>;
interface TreeModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  onChange?: (e: any) => void;
  value?: any;
}
const FunctionTreeModal = ({
  visible,
  setVisible,
  onChange,
  value,
}: TreeModalProps) => {
  const [treeData, setTreeData] = useState<IFunction[]>([]);
  const [checkKeys, setCheckKeys] = useState<React.Key[]>([]);
  useRequest(getFunctionTree, {
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
  }, [value]);
  const onCheck: TreeProps['onCheck'] = (checkedKeys, info) => {
    console.log('onCheck', checkedKeys, info);
    if (isArray(checkedKeys)) {
      setCheckKeys(checkedKeys);
    }
  };

  function onOk() {
    onChange?.(checkKeys);
    setVisible(false);
    setCheckKeys([]);
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
export default FunctionTreeModal;
