import { useCallback, useEffect, useState } from 'react';
import { Button, Card, Col, Row, Statistic, Typography, message } from 'antd';
import { AppstoreOutlined, CheckCircleOutlined, ClockCircleOutlined, DollarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { errorMessage, fetchStatistics } from '../../api/admin';
import type { StatisticsOverview } from '../../types/admin';

const { Paragraph } = Typography;

export default function AdminHome() {
  const navigate = useNavigate();
  const [data, setData] = useState<StatisticsOverview | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setData(await fetchStatistics());
    } catch (error) {
      message.error(errorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <>
      <Paragraph type="secondary">平台运营数据与后台管理入口。</Paragraph>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card loading={loading} hoverable onClick={() => navigate('/admin/merchants')}>
            <Statistic title="待审核商家" value={data?.pendingMerchants ?? 0} prefix={<ClockCircleOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card loading={loading}>
            <Statistic title="已通过商家" value={data?.approvedMerchants ?? 0} prefix={<CheckCircleOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card loading={loading}>
            <Statistic title="分类总数" value={data?.totalCategories ?? 0} prefix={<AppstoreOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card loading={loading}>
            <Statistic title="今日交易额" value={data?.todayRevenue ?? 0} prefix={<DollarOutlined />} />
          </Card>
        </Col>
      </Row>
      <Card title="管理入口" className="workspace-card">
        <Row gutter={[12, 12]}>
          <Col><Button onClick={() => navigate('/admin/merchants')}>商家审核</Button></Col>
          <Col><Button onClick={() => navigate('/admin/categories')}>分类管理</Button></Col>
          <Col><Button onClick={() => navigate('/admin/statistics')}>平台统计</Button></Col>
        </Row>
      </Card>
    </>
  );
}
