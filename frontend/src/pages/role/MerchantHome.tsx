import { useState } from 'react';
import { Button, Card, Col, Form, Input, Row, Tag, Typography, message } from 'antd';
import { AppstoreOutlined, ShopOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { applyMerchant, errorMessage } from '../../api/admin';

const { Paragraph } = Typography;

interface ApplyFormValues {
  name: string;
  contactName: string;
  phone: string;
  address: string;
  description?: string;
}

export default function MerchantHome() {
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm<ApplyFormValues>();

  const submit = async (values: ApplyFormValues) => {
    setSubmitting(true);
    try {
      await applyMerchant(values);
      message.success('申请已提交，等待平台审核');
      form.resetFields();
    } catch (error) {
      message.error(errorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Card title="商家入驻申请" className="workspace-card">
        <Paragraph type="secondary">填写店铺信息提交审核，审核通过后即可在平台经营。</Paragraph>
        <Form form={form} layout="vertical" onFinish={submit}>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item name="name" label="店铺名称" rules={[{ required: true, message: '请输入店铺名称' }]}>
                <Input placeholder="店铺名称" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="contactName" label="联系人" rules={[{ required: true, message: '请输入联系人' }]}>
                <Input placeholder="联系人" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="phone" label="联系电话" rules={[{ required: true, message: '请输入联系电话' }]}>
                <Input placeholder="联系电话" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="address" label="店铺地址" rules={[{ required: true, message: '请输入店铺地址' }]}>
                <Input placeholder="店铺地址" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="description" label="店铺简介">
                <Input.TextArea rows={3} placeholder="选填" />
              </Form.Item>
            </Col>
          </Row>
          <Button type="primary" htmlType="submit" loading={submitting}>提交申请</Button>
        </Form>
      </Card>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}><Card><div className="workspace-icon"><ShopOutlined /></div><strong>店铺管理</strong><Paragraph type="secondary">设置营业状态和店铺信息</Paragraph></Card></Col>
        <Col xs={24} sm={8}><Card><div className="workspace-icon"><AppstoreOutlined /></div><strong>商品管理</strong><Paragraph type="secondary">维护商品和菜单</Paragraph></Card></Col>
        <Col xs={24} sm={8}><Card><div className="workspace-icon"><ShoppingCartOutlined /></div><strong>订单处理</strong><Paragraph type="secondary">查看并处理顾客订单</Paragraph></Card></Col>
      </Row>
      <Card title="商家端功能" className="workspace-card"><Tag>店铺资料</Tag><Tag>商品上下架</Tag><Tag>订单状态</Tag></Card>
    </>
  );
}
