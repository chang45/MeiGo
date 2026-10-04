import { Card, Col, Row, Statistic, Tag, Typography } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, ShoppingOutlined } from '@ant-design/icons';

const { Paragraph } = Typography;

export default function ConsumerHome() {
  return (
    <>
      <Paragraph type="secondary">浏览、下单、支付、评价等消费者功能将在后续版本接入。</Paragraph>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}><Card><Statistic title="进行中的订单" value={0} prefix={<ClockCircleOutlined />} /></Card></Col>
        <Col xs={24} sm={8}><Card><Statistic title="累计订单" value={0} prefix={<ShoppingOutlined />} /></Card></Col>
        <Col xs={24} sm={8}><Card><Statistic title="已完成评价" value={0} prefix={<CheckCircleOutlined />} /></Card></Col>
      </Row>
      <Card title="消费者功能" className="workspace-card">
        <Tag>我的订单</Tag><Tag>收货地址</Tag><Tag>我的评价</Tag>
      </Card>
    </>
  );
}
