import { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Card,
  Col,
  Descriptions,
  Form,
  Input,
  Row,
  Spin,
  Tag,
  Typography,
  message,
} from 'antd';
import { AppstoreOutlined, ReloadOutlined, ShopOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { applyMerchant, errorMessage, fetchMyStore } from '../../api/admin';
import type { Merchant } from '../../types/admin';

const { Paragraph } = Typography;

interface ApplyFormValues {
  name: string;
  contactName: string;
  phone: string;
  address: string;
  description?: string;
}

const STATUS_TAG: Record<Merchant['status'], { color: string; label: string }> = {
  pending: { color: 'processing', label: '审核中' },
  approved: { color: 'success', label: '已通过' },
  rejected: { color: 'error', label: '已驳回' },
};

export default function MerchantHome() {
  const [store, setStore] = useState<Merchant | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm<ApplyFormValues>();

  const load = async () => {
    setLoading(true);
    try {
      setStore(await fetchMyStore());
    } catch (error) {
      message.error(errorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const startReapply = () => {
    if (!store) {
      return;
    }
    form.setFieldsValue({
      name: store.name,
      contactName: store.contactName,
      phone: store.phone,
      address: store.address,
      description: store.description ?? undefined,
    });
    setEditing(true);
  };

  const submit = async (values: ApplyFormValues) => {
    setSubmitting(true);
    try {
      await applyMerchant(values);
      message.success(store ? '已重新提交，等待平台审核' : '申请已提交，等待平台审核');
      setEditing(false);
      await load();
    } catch (error) {
      message.error(errorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Spin style={{ display: 'block', marginTop: 48 }} />;
  }

  const showForm = !store || editing;
  const statusMeta = store ? STATUS_TAG[store.status] : null;

  return (
    <>
      {store?.status === 'rejected' && !editing && (
        <Alert
          type="warning"
          showIcon
          style={{ marginTop: 24 }}
          message="店铺申请未通过"
          description={store.rejectReason || '平台未填写驳回原因，请修改后重新提交'}
          action={
            <Button size="small" icon={<ReloadOutlined />} onClick={startReapply}>
              重新申请
            </Button>
          }
        />
      )}

      {store?.status === 'pending' && (
        <Alert
          type="info"
          showIcon
          style={{ marginTop: 24 }}
          message="店铺审核中"
          description="平台正在审核你的店铺资料，通过后即可开始经营。一个商家只能注册一个店铺。"
        />
      )}

      {showForm ? (
        <Card title={store ? '重新提交店铺申请' : '商家入驻申请'} className="workspace-card">
          {!store && (
            <Paragraph type="secondary">
              填写店铺信息提交审核，审核通过后即可在平台经营。注意：一个商家只能注册一个店铺。
            </Paragraph>
          )}
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
            <Button type="primary" htmlType="submit" loading={submitting}>
              {store ? '重新提交' : '提交申请'}
            </Button>
          </Form>
        </Card>
      ) : (
        <>
          {store && statusMeta && (
            <Card
              className="workspace-card"
              title={
                <span>
                  我的店铺 <Tag color={statusMeta.color}>{statusMeta.label}</Tag>
                </span>
              }
            >
              <Descriptions column={{ xs: 1, sm: 2 }}>
                <Descriptions.Item label="店铺名称">{store.name}</Descriptions.Item>
                <Descriptions.Item label="联系人">{store.contactName}</Descriptions.Item>
                <Descriptions.Item label="联系电话">{store.phone}</Descriptions.Item>
                <Descriptions.Item label="店铺地址">{store.address}</Descriptions.Item>
                <Descriptions.Item label="店铺简介" span={2}>
                  {store.description || '暂无简介'}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          )}

          {store?.status === 'approved' ? (
            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
              <Col xs={24} sm={8}>
                <Card>
                  <div className="workspace-icon"><ShopOutlined /></div>
                  <strong>店铺管理</strong>
                  <Paragraph type="secondary">设置营业状态和店铺信息</Paragraph>
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card>
                  <div className="workspace-icon"><AppstoreOutlined /></div>
                  <strong>商品管理</strong>
                  <Paragraph type="secondary">维护商品和菜单</Paragraph>
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card>
                  <div className="workspace-icon"><ShoppingCartOutlined /></div>
                  <strong>订单处理</strong>
                  <Paragraph type="secondary">查看并处理顾客订单</Paragraph>
                </Card>
              </Col>
            </Row>
          ) : (
            <Paragraph type="secondary" style={{ marginTop: 16 }}>
              审核通过后即可使用店铺管理、商品管理、订单处理等功能。
            </Paragraph>
          )}
        </>
      )}
    </>
  );
}
