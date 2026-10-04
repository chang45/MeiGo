import { useState } from 'react';
import { Button, Card, Form, Input, Radio, Space, Typography, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { ROLE_HOME, ROLE_LABELS, type RegisterInput, type SelfRegisterRole } from '../types/auth';

const { Title, Text } = Typography;

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm<RegisterInput & { confirmPassword: string }>();
  const register = useAuthStore((state) => state.register);
  const navigate = useNavigate();

  const submit = async (values: RegisterInput & { confirmPassword: string }) => {
    setLoading(true);
    try {
      const user = await register({
        username: values.username,
        password: values.password,
        nickname: values.nickname,
        role: values.role,
      });
      message.success('注册成功，欢迎加入 Meigo');
      navigate(ROLE_HOME[user.role], { replace: true });
    } catch (error) {
      message.error(error instanceof Error ? error.message : '注册失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Card className="auth-card">
        <div className="auth-brand">Meigo<span className="logo-dot">.</span></div>
        <Title level={3}>注册账号</Title>
        <Text type="secondary">选择你的身份，开启本地生活服务</Text>
        <Form<RegisterInput & { confirmPassword: string }>
          form={form}
          layout="vertical"
          onFinish={submit}
          initialValues={{ role: 'consumer' as SelfRegisterRole }}
          className="auth-form"
        >
          <Form.Item
            label="用户名"
            name="username"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 3, max: 20, message: '用户名长度为 3-20 个字符' },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="3-20 个字符" size="large" />
          </Form.Item>
          <Form.Item
            label="昵称"
            name="nickname"
            rules={[{ max: 20, message: '昵称不能超过 20 个字符' }]}
          >
            <Input placeholder="选填，默认使用用户名" size="large" />
          </Form.Item>
          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: '请输入密码' }, { min: 6, message: '密码至少 6 位' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="至少 6 位" size="large" />
          </Form.Item>
          <Form.Item
            label="确认密码"
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: '请再次输入密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  return !value || getFieldValue('password') === value
                    ? Promise.resolve()
                    : Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="请再次输入密码" size="large" />
          </Form.Item>
          <Form.Item label="注册身份" name="role">
            <Radio.Group optionType="button" buttonStyle="solid">
              <Radio.Button value="consumer">{ROLE_LABELS.consumer}</Radio.Button>
              <Radio.Button value="merchant">{ROLE_LABELS.merchant}</Radio.Button>
              <Radio.Button value="rider">{ROLE_LABELS.rider}</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Text type="secondary" className="role-tip">
            平台管理员账号由平台分配，不开放公开注册。
          </Text>
          <Button type="primary" htmlType="submit" block size="large" loading={loading}>
            注册并登录
          </Button>
        </Form>
        <div className="auth-footer">
          已有账号？<Link to="/login">返回登录</Link>
        </div>
      </Card>
    </div>
  );
}
