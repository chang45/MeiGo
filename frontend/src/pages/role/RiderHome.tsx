import { Card, Col, Row, Tag, Typography } from 'antd';
import { CarOutlined, CheckCircleOutlined, InboxOutlined } from '@ant-design/icons';

const { Paragraph } = Typography;

export default function RiderHome() {
  return (
    <>
      <Paragraph type="secondary">接单、取货、送达和配送状态流转将在后端接口完成后启用。</Paragraph>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}><Card><div className="workspace-icon"><InboxOutlined /></div><strong>待接订单</strong><Paragraph type="secondary">查看附近待配送订单</Paragraph></Card></Col>
        <Col xs={24} sm={8}><Card><div className="workspace-icon"><CarOutlined /></div><strong>配送中</strong><Paragraph type="secondary">更新取货和送达状态</Paragraph></Card></Col>
        <Col xs={24} sm={8}><Card><div className="workspace-icon"><CheckCircleOutlined /></div><strong>配送记录</strong><Paragraph type="secondary">查看历史配送和收入</Paragraph></Card></Col>
      </Row>
      <Card title="骑手端状态" className="workspace-card"><Tag color="blue">待接单</Tag><Tag color="orange">取货中</Tag><Tag color="green">配送完成</Tag></Card>
    </>
  );
}
