import { Avatar, Button, Layout, Menu, Space, Tag, Typography } from 'antd';
import type { MenuProps } from 'antd';
import { ArrowLeftOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ROLE_HOME, ROLE_LABELS, type Role } from '../types/auth';
import { useAuthStore } from '../store/auth';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

const workspaceMenus: Record<Role, MenuProps['items']> = {
  consumer: [
    { key: '/consumer', label: '个人中心' },
    { key: 'consumer-orders', label: '我的订单', disabled: true },
    { key: 'consumer-reviews', label: '我的评价', disabled: true },
  ],
  merchant: [
    { key: '/merchant', label: '工作台' },
    { key: 'merchant-store', label: '店铺管理', disabled: true },
    { key: 'merchant-products', label: '商品管理', disabled: true },
    { key: 'merchant-orders', label: '订单处理', disabled: true },
  ],
  rider: [
    { key: '/rider', label: '工作台' },
    { key: 'rider-orders', label: '待接单', disabled: true },
    { key: 'rider-delivery', label: '配送状态', disabled: true },
    { key: 'rider-history', label: '配送记录', disabled: true },
  ],
  admin: [
    { key: '/admin', label: '数据看板' },
    { key: 'admin-merchants', label: '商家审核', disabled: true },
    { key: 'admin-categories', label: '分类管理', disabled: true },
    { key: 'admin-statistics', label: '平台统计', disabled: true },
  ],
};

export default function ConsoleLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  if (!user) {
    return null;
  }

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key.startsWith('/')) {
      navigate(key);
    }
  };

  return (
    <Layout className="console-layout">
      <Sider breakpoint="lg" collapsedWidth="0" className="console-sider">
        <div className="console-brand">Meigo<span className="logo-dot">.</span></div>
        <div className="console-role">
          <Avatar icon={<UserOutlined />} />
          <div>
            <Text strong>{user.nickname}</Text>
            <Tag color="blue">{ROLE_LABELS[user.role]}</Tag>
          </div>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={workspaceMenus[user.role]}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
        <Header className="console-header">
          <Space>
            <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate('/')}>
              返回前台
            </Button>
            <Button
              type="text"
              danger
              icon={<LogoutOutlined />}
              onClick={() => {
                logout();
                navigate('/');
              }}
            >
              退出
            </Button>
          </Space>
        </Header>
        <Content className="console-content">
          <Title level={3}>{ROLE_LABELS[user.role]}工作台</Title>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
