import { useAppSelector } from '@/store/hooks';
import { easyConfirm } from '@/utils/tools';
import { useNavigate } from '@@/exports';
import { RunTimeLayoutConfig } from '@@/plugin-layout/types';
import { BellOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Badge, Dropdown } from 'antd';
import { MenuProps } from 'antd/lib/menu';
import './index.less';
// get right render type

type RightRender = Exclude<
  NonNullable<ReturnType<RunTimeLayoutConfig>['rightContentRender']>,
  false
>;
type Props = Parameters<RightRender>[2];

const RightAvatar = (prop: Props): JSX.Element => {
  console.log('prop', prop);
  const navigate = useNavigate();
  const { userInfo } = useAppSelector((state) => state.auth);
  const menuItems: MenuProps['items'] = [
    {
      key: 'center',
      label: '个人中心',
      onClick: async () => {
        await easyConfirm('提示', '确定要去个人中心吗？');
        navigate('/personal/profile');
      },
    },
    {
      key: 'message',
      label: '消息中心',
      onClick: async () => {
        await easyConfirm('提示', '确定要去消息中心吗？');
        navigate('/setting/message');
      },
    },
    {
      key: 'logout',
      label: '退出登录',
    },
  ];
  return (
    <div className={'flex gap-2'}>
      <span>
        <Badge count={20}>
          <BellOutlined style={{ fontSize: '24px' }} />
        </Badge>
      </span>
      <Dropdown
        trigger={['click']}
        className={'avatar-dropdown'}
        overlayClassName={'avatar-dropdown-overlay'}
        openClassName={'avatar-dropdown-open'}
        menu={{
          items: menuItems,
          // note 在这里设置dropdown的样式，比如修改圆角
          rootClassName: '!rounded-[16px] w-[200px] text-center myAvatar',
        }}
      >
        <div className={'  cursor-pointer rounded-md hover:bg-gray-200 px-4 '}>
          <Avatar
            className={'inline-block !mr-3'}
            size={44}
            icon={<UserOutlined />}
            src={
              'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg'
            }
          />
          <span className={' inline-block text-sm'}>{userInfo.name}</span>
        </div>
      </Dropdown>
    </div>
  );
};
export default RightAvatar;
