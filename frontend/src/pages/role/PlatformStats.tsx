import { useCallback, useEffect, useState } from 'react';
import { Card, Col, Progress, Row, Statistic, message } from 'antd';
import { errorMessage, fetchStatistics } from '../../api/admin';
import type { StatisticsOverview } from '../../types/admin';

export default function PlatformStats() {
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

  const merchantTotal = data?.totalMerchants ?? 0;
  const approvedPercent = merchantTotal ? Math.round(((data?.approvedMerchants ?? 0) / merchantTotal) * 100) : 0;

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}><Card loading={loading}><Statistic title="商家总数" value={data?.totalMerchants ?? 0} /></Card></Col>
        <Col xs={24} sm={12} md={6}><Card loading={loading}><Statistic title="待审核商家" value={data?.pendingMerchants ?? 0} /></Card></Col>
        <Col xs={24} sm={12} md={6}><Card loading={loading}><Statistic title="已通过商家" value={data?.approvedMerchants ?? 0} /></Card></Col>
        <Col xs={24} sm={12} md={6}><Card loading={loading}><Statistic title="分类总数" value={data?.totalCategories ?? 0} /></Card></Col>
      </Row>
      <Card title="商家审核进度" className="workspace-card">
        <Progress percent={approvedPercent} status={approvedPercent === 100 ? 'success' : 'active'} />
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col xs={12} md={6}><Statistic title="已驳回商家" value={data?.rejectedMerchants ?? 0} /></Col>
          <Col xs={12} md={6}><Statistic title="启用分类" value={data?.enabledCategories ?? 0} /></Col>
          <Col xs={12} md={6}><Statistic title="今日订单" value={data?.todayOrders ?? 0} /></Col>
          <Col xs={12} md={6}><Statistic title="今日交易额" value={data?.todayRevenue ?? 0} prefix="¥" /></Col>
        </Row>
      </Card>
    </>
  );
}
