import { Badge, Button, Dropdown, Input, Select, Space, Tag } from 'antd';
import type { MenuProps } from 'antd';
import {
  DownOutlined,
  EnvironmentOutlined,
  LogoutOutlined,
  SearchOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { ROLE_HOME, ROLE_LABELS } from '../types/auth';
import { useAuthStore } from '../store/auth';

const cities = ['北京', '上海', '广州', '深圳'];
const cityItems = cities.map((city) => ({ key: city, label: city }));

const searchOptions = ['全部', '外卖', '到店美食', '超市便利', '果蔬生鲜', '买药'].map((value) => ({
  value,
  label: value,
}));

interface HeaderProps {
  city: string;
  onCityChange: (city: string) => void;
}

export default function Header({ city, onCityChange }: HeaderProps) {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const userMenuItems: MenuProps['items'] = user
    ? [
        {
          key: 'workspace',
          icon: <SettingOutlined />,
          label: `进入${ROLE_LABELS[user.role]}工作台`,
        },
        { type: 'divider' },
        { key: 'logout', icon: <LogoutOutlined />, label: '退出登录' },
      ]
    : [];

  const handleUserMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'workspace' && user) {
      navigate(user.role === 'consumer' ? '/consumer' : ROLE_HOME[user.role]);
    }
    if (key === 'logout') {
      logout();
      navigate('/');
    }
  };

  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="logo" role="button" tabIndex={0} onClick={() => navigate('/')}>
          Meigo<span className="logo-dot">.</span>
        </div>

        <Dropdown
          menu={{ items: cityItems, onClick: ({ key }) => onCityChange(key) }}
          trigger={['hover']}
        >
          <span className="city-switch">
            <EnvironmentOutlined />
            {city}
            <DownOutlined className="city-arrow" />
          </span>
        </Dropdown>

        <Space.Compact block className="header-search">
          <Select className="search-select" defaultValue="全部" options={searchOptions} size="large" />
          <Input className="search-input" placeholder="搜索商家、商品或服务" size="large" />
          <Button
            className="search-button"
            size="large"
            icon={<SearchOutlined />}
            aria-label="搜索"
          />
        </Space.Compact>

        <div className="header-actions">
          {user ? (
            <Dropdown menu={{ items: userMenuItems, onClick: handleUserMenuClick }} trigger={['click']}>
              <Button type="text" className="user-menu-button">
                <Space size={6}>
                  <UserOutlined />
                  <span>{user.nickname}</span>
                  <Tag color="blue">{ROLE_LABELS[user.role]}</Tag>
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
          ) : (
            <>
              <Button type="text" size="large" onClick={() => navigate('/login')}>
                登录
              </Button>
              <Button type="primary" size="large" className="signup-btn" onClick={() => navigate('/register')}>
                注册
              </Button>
            </>
          )}
          <Badge count={user ? 0 : 1} size="small" offset={[2, -2]}>
            <ShoppingCartOutlined className="cart-icon" />
          </Badge>
        </div>
      </div>
    </header>
  );
}
