import { useState } from 'react';
import { Alert, Button, Card, Divider, Form, Input, Space, Typography, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { DEMO_ACCOUNTS } from '../api/auth';
import { useAuthStore } from '../store/auth';
import { ROLE_HOME, ROLE_LABELS, type LoginInput, type Role } from '../types/auth';

const { Title, Text } = Typography;

function getRedirect(search: string, role: Role) {
  const redirect = new URLSearchParams(search).get('redirect');
  return redirect || ROLE_HOME[role];
}

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm<LoginInput>();
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const location = useLocation();

  const submit = async (values: LoginInput) => {
    setLoading(true);
    try {
      const user = await login(values);
      message.success(`欢迎回来，${user.nickname}`);
      navigate(getRedirect(location.search, user.role), { replace: true });
    } catch (error) {
      message.error(error instanceof Error ? error.message : '登录失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (username: string, password: string) => {
    form.setFieldsValue({ username, password });
    await form.submit();
  };

  return (
    <div className="auth-page">
      <Card className="auth-card">
        <div className="auth-brand">Meigo<span className="logo-dot">.</span></div>
        <Title level={3}>登录 Meigo</Title>
        <Text type="secondary">登录后享受更完整的本地生活服务</Text>
        <Form<LoginInput> form={form} layout="vertical" onFinish={submit} className="auth-form">
          <Form.Item
            label="用户名"
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="请输入用户名" size="large" />
          </Form.Item>
          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="请输入密码" size="large" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block size="large" loading={loading}>
            登录
          </Button>
        </Form>
        <Divider plain>演示账号</Divider>
        <Space wrap className="demo-accounts">
          {DEMO_ACCOUNTS.map((account) => (
            <Button
              key={account.username}
              size="small"
              onClick={() => quickLogin(account.username, account.password)}
            >
              {ROLE_LABELS[account.role]}
            </Button>
          ))}
        </Space>
        <Alert
          className="demo-tip"
          type="info"
          showIcon
          message="消费者、商家、骑手密码为 123456；管理员密码为 admin123"
        />
        <div className="auth-footer">
          还没有账号？<Link to="/register">立即注册</Link>
        </div>
      </Card>
    </div>
  );
}
