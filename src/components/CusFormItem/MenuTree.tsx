import { FormItemProps } from '@/components/CusFormItem/ItemUpload';
import TreeModal from '@/pages/System/components/TreeModal';
import { Typography } from 'antd';
import { useState } from 'react';
const { Link } = Typography;

const MenuTree = ({ onChange, value }: FormItemProps<any>) => {
  console.log('menuTree', value);
  const [visible, setVisible] = useState(false);
  return (
    <>
      <Link onClick={() => setVisible(true)}>分配菜单</Link>
      <TreeModal
        onChange={onChange}
        visible={visible}
        setVisible={setVisible}
        value={value}
      />
    </>
  );
};
export default MenuTree;
