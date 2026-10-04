import { Card, Col, Row, Statistic, Tag, Typography } from 'antd';
import { BarChartOutlined, ProfileOutlined, ShopOutlined } from '@ant-design/icons';

const { Paragraph } = Typography;

export default function AdminHome() {
  return (
    <>
      <Paragraph type="secondary">平台管理员可以审核商家、管理分类并查看平台统计数据。</Paragraph>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}><Card><Statistic title="待审核商家" value={0} prefix={<ShopOutlined />} /></Card></Col>
        <Col xs={24} sm={8}><Card><Statistic title="平台订单" value={0} prefix={<ProfileOutlined />} /></Card></Col>
        <Col xs={24} sm={8}><Card><Statistic title="今日交易额" value={0} prefix="¥" /></Card></Col>
      </Row>
      <Card title="管理功能" className="workspace-card">
        <Tag>商家审核</Tag><Tag>分类管理</Tag><Tag>数据看板</Tag><BarChartOutlined className="workspace-chart-icon" />
      </Card>
    </>
  );
}
