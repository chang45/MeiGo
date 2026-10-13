import { useCallback, useEffect, useState } from 'react';
import { Button, Card, Empty, Input, message, Modal, Popconfirm, Space, Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import { errorMessage, fetchMerchants, reviewMerchant } from '../../api/admin';
import type { Merchant, MerchantStatus } from '../../types/admin';

const STATUS_META: Record<MerchantStatus, { color: string; label: string }> = {
  pending: { color: 'orange', label: '待审核' },
  approved: { color: 'green', label: '已通过' },
  rejected: { color: 'red', label: '已驳回' },
};

export default function MerchantReview() {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<MerchantStatus>('pending');
  const [rejecting, setRejecting] = useState<Merchant | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setMerchants(await fetchMerchants(status));
    } catch (error) {
      message.error(errorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleApprove = async (record: Merchant) => {
    try {
      await reviewMerchant(record.id, { approve: true });
      message.success('已通过');
      await load();
    } catch (error) {
      message.error(errorMessage(error));
    }
  };

  const submitReject = async () => {
    if (!rejecting) return;
    setSubmitting(true);
    try {
      await reviewMerchant(rejecting.id, { approve: false, reason: rejectReason.trim() || undefined });
      message.success('已驳回');
      setRejecting(null);
      setRejectReason('');
      await load();
    } catch (error) {
      message.error(errorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  const columns: TableProps<Merchant>['columns'] = [
    { title: '店铺名称', dataIndex: 'name' },
    { title: '联系人', dataIndex: 'contactName' },
    { title: '联系电话', dataIndex: 'phone' },
    { title: '店铺地址', dataIndex: 'address', ellipsis: true },
    {
      title: '状态',
      dataIndex: 'status',
      render: (value: MerchantStatus) => (
        <Tag color={STATUS_META[value].color}>{STATUS_META[value].label}</Tag>
      ),
    },
    {
      title: '申请时间',
      dataIndex: 'createTime',
      render: (value: string) => new Date(value).toLocaleString('zh-CN'),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => {
        if (record.status !== 'pending') {
          return record.status === 'rejected' && record.rejectReason ? `原因：${record.rejectReason}` : null;
        }
        return (
          <Space>
            <Popconfirm title="确认通过该商家入驻申请？" onConfirm={() => handleApprove(record)}>
              <Button type="primary" size="small">通过</Button>
            </Popconfirm>
            <Button danger size="small" onClick={() => setRejecting(record)}>驳回</Button>
          </Space>
        );
      },
    },
  ];

  return (
    <Card
      title="商家审核"
      extra={
        <Space>
          {(Object.keys(STATUS_META) as MerchantStatus[]).map((value) => (
            <Button
              key={value}
              type={status === value ? 'primary' : 'default'}
              onClick={() => setStatus(value)}
            >
              {STATUS_META[value].label}
            </Button>
          ))}
        </Space>
      }
    >
      <Table<Merchant>
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={merchants}
        locale={{ emptyText: <Empty description="暂无商家数据" /> }}
        pagination={{ pageSize: 10 }}
      />
      <Modal
        title="驳回申请"
        open={rejecting !== null}
        onOk={submitReject}
        onCancel={() => {
          setRejecting(null);
          setRejectReason('');
        }}
        confirmLoading={submitting}
        okText="确认驳回"
      >
        <Input.TextArea
          rows={3}
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          placeholder="填写驳回原因（可选）"
        />
      </Modal>
    </Card>
  );
}
