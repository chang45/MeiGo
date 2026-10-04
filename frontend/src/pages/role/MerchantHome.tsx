import { Card, Col, Row, Tag, Typography } from 'antd';
import { AppstoreOutlined, ShopOutlined, ShoppingCartOutlined } from '@ant-design/icons';

const { Paragraph } = Typography;

export default function MerchantHome() {
  return (
    <>
      <Paragraph type="secondary">管理店铺、商品和订单的商家工作台，业务接口将在后端完成后接入。</Paragraph>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}><Card><div className="workspace-icon"><ShopOutlined /></div><strong>店铺管理</strong><Paragraph type="secondary">设置营业状态和店铺信息</Paragraph></Card></Col>
        <Col xs={24} sm={8}><Card><div className="workspace-icon"><AppstoreOutlined /></div><strong>商品管理</strong><Paragraph type="secondary">维护商品和菜单</Paragraph></Card></Col>
        <Col xs={24} sm={8}><Card><div className="workspace-icon"><ShoppingCartOutlined /></div><strong>订单处理</strong><Paragraph type="secondary">查看并处理顾客订单</Paragraph></Card></Col>
      </Row>
      <Card title="商家端功能" className="workspace-card"><Tag>店铺资料</Tag><Tag>商品上下架</Tag><Tag>订单状态</Tag></Card>
    </>
  );
}
