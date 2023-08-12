import {
  CopyOutlined,
  HighlightOutlined,
  HomeOutlined,
  LockOutlined,
  MenuOutlined,
  PicCenterOutlined,
  ScheduleOutlined,
  SettingOutlined,
  ShopOutlined,
  SolutionOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
interface IconMap {
  [key: string]: JSX.Element;
}
export const iconMap: IconMap = {
  home: <HomeOutlined />,
  setting: <SettingOutlined />,
  user: <SolutionOutlined />,
  menu: <MenuOutlined />,
  series: <CopyOutlined />,
  modify: <HighlightOutlined />,
  component: <PicCenterOutlined />,
  meeting: <ScheduleOutlined />,
  warehouse: <ShopOutlined />,
  role: <TeamOutlined />,
  permission: <LockOutlined />,
  me: <UserOutlined />,
};
function renderIcon(name: string) {
  return iconMap[name] || null;
}
export default renderIcon;
