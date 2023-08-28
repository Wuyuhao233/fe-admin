import { reset } from '@/store/auth';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { changeThemeImg } from '@/store/theme';
import { easyConfirm } from '@/utils/tools';
import { useModel, useNavigate } from '@@/exports';
import {
  LogoutOutlined,
  QuestionCircleOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { SelectLang } from '@umijs/max';
import { DropDownProps, Dropdown, Spin } from 'antd';
import React, { useCallback } from 'react';
import { flushSync } from 'react-dom';
export const LangSelect = () => {
  return (
    <SelectLang
      style={{
        padding: 4,
      }}
    />
  );
};

export const Question = () => {
  return (
    <div
      style={{
        display: 'flex',
        height: 26,
      }}
      onClick={() => {
        window.open('https://pro.ant.design/docs/getting-started');
      }}
    >
      <QuestionCircleOutlined />
    </div>
  );
};
export const AvatarName = () => {
  const { initialState } = useModel('@@initialState');
  const { user } = initialState || {};
  return <span className="anticon">{user?.name}</span>;
};
/**
 * dropdown menu
 */
export type HeaderDropdownProps = {
  overlayClassName?: string;
  placement?:
    | 'bottomLeft'
    | 'bottomRight'
    | 'topLeft'
    | 'topCenter'
    | 'topRight'
    | 'bottomCenter';
} & Omit<DropDownProps, 'overlay'>;

export const HeaderDropdown: React.FC<HeaderDropdownProps> = ({
  ...restProps
}) => {
  return <Dropdown {...restProps} />;
};
export type GlobalHeaderRightProps = {
  menu?: boolean;
  children?: React.ReactNode;
};
/**
 * detail dropdown menu
 * @param menu
 * @param children
 * @constructor
 */
export const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({
  menu,
  children,
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  /**
   * 退出登录，并且将当前的 url 保存
   */
  const loginOut = async () => {
    await easyConfirm('提示', '确定要退出登录吗？');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    dispatch(reset());
    navigate('/login');
  };
  const { initialState, setInitialState } = useModel('@@initialState');

  const onMenuClick = useCallback(
    (event: any) => {
      console.log('onMenuClick', event);
      const { key } = event;
      if (key === 'logout') {
        flushSync(() => {
          setInitialState((s) => ({ ...s, currentUser: undefined }));
        });
        loginOut();
        return;
      }
      // history.push(`/account/${key}`);
    },
    [setInitialState],
  );

  const loading = (
    <span>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const { user } = initialState;

  if (!user || !user.name) {
    return loading;
  }

  const menuItems = [
    ...(menu
      ? [
          {
            key: 'center',
            icon: <UserOutlined />,
            label: '个人中心',
          },
          {
            key: 'settings',
            icon: <SettingOutlined />,
            label: '个人设置',
          },
          {
            type: 'divider' as const,
          },
        ]
      : []),
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
  ];

  return (
    <HeaderDropdown
      menu={{
        selectedKeys: [],
        onClick: onMenuClick,
        items: menuItems,
      }}
    >
      {children}
    </HeaderDropdown>
  );
};
export const ThemeChanger = () => {
  const { themeType } = useAppSelector((state) => state.theme);
  const dispatch = useAppDispatch();

  return themeType === 'light' ? (
    <span onClick={() => dispatch(changeThemeImg())}>
      <svg
        className="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
      >
        <path d="M515.072 961.792c-254.08 0-460.8-206.72-460.8-460.8A460.16 460.16 0 0 1 299.008 94.08L359.04 62.144l-24.064 63.616a407.552 407.552 0 0 0-26.816 144.64 410.112 410.112 0 0 0 409.6 409.664c66.752 0 133.12-16.576 192.064-47.872l60.032-31.936-24.064 63.616c-67.456 178.304-240.576 298.048-430.72 298.048zM267.136 175.104a408.704 408.704 0 0 0-161.664 325.888c0 225.856 183.744 409.6 409.6 409.6a411.712 411.712 0 0 0 354.368-205.12 461.056 461.056 0 0 1-151.68 25.792c-254.08 0-460.8-206.72-460.8-460.864 0-32 3.456-63.872 10.24-95.296z"></path>
      </svg>
    </span>
  ) : (
    <span onClick={() => dispatch(changeThemeImg())}>
      <svg
        className="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
      >
        <path d="M512 276.8c-128 0-235.2 107.2-235.2 235.2S384 747.2 512 747.2 747.2 640 747.2 512 640 276.8 512 276.8z m0 384c-81.6 0-148.8-68.8-148.8-148.8s68.8-148.8 148.8-148.8 148.8 68.8 148.8 148.8-67.2 148.8-148.8 148.8zM512 171.2c25.6 0 43.2-17.6 43.2-43.2V43.2C555.2 17.6 537.6 0 512 0s-43.2 17.6-43.2 43.2V128c0 25.6 17.6 43.2 43.2 43.2zM512 852.8c-25.6 0-43.2 17.6-43.2 43.2v84.8c0 25.6 17.6 43.2 43.2 43.2s43.2-17.6 43.2-43.2V896c0-25.6-17.6-43.2-43.2-43.2zM785.6 281.6c12.8 0 20.8-4.8 30.4-12.8l51.2-51.2c17.6-17.6 17.6-43.2 0-59.2s-43.2-17.6-59.2 0l-51.2 51.2c-17.6 17.6-17.6 43.2 0 59.2 6.4 8 16 12.8 28.8 12.8zM209.6 755.2l-51.2 51.2c-17.6 17.6-17.6 43.2 0 59.2 8 8 20.8 12.8 30.4 12.8s20.8-4.8 30.4-12.8l51.2-51.2c17.6-17.6 17.6-43.2 0-59.2-19.2-17.6-44.8-17.6-60.8 0zM980.8 468.8H896c-25.6 0-43.2 17.6-43.2 43.2s17.6 43.2 43.2 43.2h84.8c25.6 0 43.2-17.6 43.2-43.2s-17.6-43.2-43.2-43.2zM171.2 512c0-25.6-17.6-43.2-43.2-43.2H43.2C17.6 468.8 0 486.4 0 512s17.6 43.2 43.2 43.2H128c25.6 0 43.2-17.6 43.2-43.2zM814.4 755.2c-17.6-17.6-43.2-17.6-59.2 0s-17.6 43.2 0 59.2l51.2 51.2c8 8 20.8 12.8 30.4 12.8 8 0 20.8-4.8 30.4-12.8 17.6-17.6 17.6-43.2 0-59.2l-52.8-51.2zM209.6 268.8c8 8 20.8 12.8 30.4 12.8s20.8-4.8 30.4-12.8c17.6-17.6 17.6-43.2 0-59.2l-51.2-51.2c-17.6-17.6-43.2-17.6-59.2 0s-17.6 43.2 0 59.2l49.6 51.2z"></path>
      </svg>
    </span>
  );
};
