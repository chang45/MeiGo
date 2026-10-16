import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { Button, Card, Empty, List, Space, Spin, Tag, Typography, message } from 'antd';
import { CarOutlined, CheckCircleOutlined, InboxOutlined } from '@ant-design/icons';
import {
  acceptOrder,
  errorMessage,
  fetchAvailableOrders,
  fetchDeliveryHistory,
  fetchMyDeliveries,
  updateOrderStatus,
} from '../../api/rider';
import { ORDER_STATUS_LABELS, type Order, type OrderStatus } from '../../types/order';

const { Paragraph } = Typography;

const STATUS_COLOR: Record<OrderStatus, string> = {
  pending: 'blue',
  accepted: 'orange',
  delivering: 'gold',
  completed: 'green',
};

export default function RiderHome() {
  const [available, setAvailable] = useState<Order[]>([]);
  const [mine, setMine] = useState<Order[]>([]);
  const [history, setHistory] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [availableOrders, myDeliveries, deliveryHistory] = await Promise.all([
        fetchAvailableOrders(),
        fetchMyDeliveries(),
        fetchDeliveryHistory(),
      ]);
      setAvailable(availableOrders);
      setMine(myDeliveries);
      setHistory(deliveryHistory);
    } catch (error) {
      message.error(errorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleAccept = async (id: number) => {
    try {
      await acceptOrder(id);
      message.success('接单成功');
      await load();
    } catch (error) {
      message.error(errorMessage(error));
    }
  };

  const handleStatus = async (order: Order, status: 'delivering' | 'completed') => {
    try {
      await updateOrderStatus(order.id, status);
      message.success(status === 'delivering' ? '已开始配送' : '订单已送达');
      await load();
    } catch (error) {
      message.error(errorMessage(error));
    }
  };

  const renderOrder = (order: Order, actions?: ReactNode[]) => (
    <List.Item actions={actions}>
      <List.Item.Meta
        title={
          <Space>
            <span>{order.merchantName}</span>
            <Tag color={STATUS_COLOR[order.status]}>{ORDER_STATUS_LABELS[order.status]}</Tag>
          </Space>
        }
        description={
          <>
            <div>订单号：{order.orderNo}</div>
            <div>顾客：{order.customerName}（{order.customerPhone}）</div>
            <div>配送地址：{order.deliveryAddress}</div>
          </>
        }
      />
    </List.Item>
  );

  if (loading) {
    return <Spin style={{ display: 'block', marginTop: 48 }} />;
  }

  return (
    <>
      <Paragraph type="secondary">接单、取货、送达的状态流转已接入后端，可实时操作。</Paragraph>

      <Card title={<Space><InboxOutlined />待接订单</Space>} className="workspace-card">
        <List
          dataSource={available}
          locale={{ emptyText: <Empty description="暂无可接订单" /> }}
          renderItem={(order) =>
            renderOrder(order, [
              <Button key="accept" type="primary" size="small" onClick={() => void handleAccept(order.id)}>
                接单
              </Button>,
            ])
          }
        />
      </Card>

      <Card title={<Space><CarOutlined />配送中</Space>} className="workspace-card">
        <List
          dataSource={mine}
          locale={{ emptyText: <Empty description="暂无配送中的订单" /> }}
          renderItem={(order) => {
            const actions: ReactNode[] = [];
            if (order.status === 'accepted') {
              actions.push(
                <Button key="deliver" size="small" onClick={() => void handleStatus(order, 'delivering')}>
                  开始配送
                </Button>,
              );
            }
            if (order.status === 'delivering') {
              actions.push(
                <Button key="complete" type="primary" size="small" onClick={() => void handleStatus(order, 'completed')}>
                  确认送达
                </Button>,
              );
            }
            return renderOrder(order, actions);
          }}
        />
      </Card>

      <Card title={<Space><CheckCircleOutlined />配送记录</Space>} className="workspace-card">
        <List
          dataSource={history}
          locale={{ emptyText: <Empty description="暂无配送记录" /> }}
          renderItem={(order) => renderOrder(order)}
        />
      </Card>
    </>
  );
}
