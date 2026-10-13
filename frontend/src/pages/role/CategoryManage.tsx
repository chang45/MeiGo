import { useCallback, useEffect, useState } from 'react';
import { Button, Card, Empty, Form, Input, InputNumber, message, Modal, Popconfirm, Space, Switch, Table } from 'antd';
import type { TableProps } from 'antd';
import {
  createCategory,
  deleteCategory,
  errorMessage,
  fetchCategories,
  updateCategory,
  type CategoryInput,
} from '../../api/admin';
import type { Category } from '../../types/admin';

export default function CategoryManage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm<CategoryInput>();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setCategories(await fetchCategories());
    } catch (error) {
      message.error(errorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const openCreate = () => {
    setEditing(null);
    form.setFieldsValue({ name: '', icon: '', sort: 0, enabled: true });
    setModalOpen(true);
  };

  const openEdit = (record: Category) => {
    setEditing(record);
    form.setFieldsValue({ name: record.name, icon: record.icon ?? '', sort: record.sort, enabled: record.enabled });
    setModalOpen(true);
  };

  const submit = async () => {
    let values: CategoryInput;
    try {
      values = await form.validateFields();
    } catch {
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await updateCategory(editing.id, values);
        message.success('分类已更新');
      } else {
        await createCategory(values);
        message.success('分类已新增');
      }
      setModalOpen(false);
      await load();
    } catch (error) {
      message.error(errorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (record: Category, enabled: boolean) => {
    try {
      await updateCategory(record.id, { enabled });
      await load();
    } catch (error) {
      message.error(errorMessage(error));
    }
  };

  const handleDelete = async (record: Category) => {
    try {
      await deleteCategory(record.id);
      message.success('分类已删除');
      await load();
    } catch (error) {
      message.error(errorMessage(error));
    }
  };

  const columns: TableProps<Category>['columns'] = [
    { title: 'ID', dataIndex: 'id', width: 70 },
    { title: '分类名称', dataIndex: 'name' },
    { title: '图标', dataIndex: 'icon', render: (value: string | null) => value || '—' },
    { title: '排序', dataIndex: 'sort', width: 80 },
    {
      title: '状态',
      dataIndex: 'enabled',
      render: (enabled: boolean, record) => (
        <Switch checked={enabled} onChange={(checked) => handleToggle(record, checked)} />
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" onClick={() => openEdit(record)}>编辑</Button>
          <Popconfirm title="确认删除该分类？" onConfirm={() => handleDelete(record)}>
            <Button type="link" danger size="small">删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="分类管理"
      extra={<Button type="primary" onClick={openCreate}>新增分类</Button>}
    >
      <Table<Category>
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={categories}
        locale={{ emptyText: <Empty description="暂无分类" /> }}
        pagination={false}
      />
      <Modal
        title={editing ? '编辑分类' : '新增分类'}
        open={modalOpen}
        onOk={submit}
        onCancel={() => setModalOpen(false)}
        confirmLoading={saving}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="分类名称" rules={[{ required: true, message: '请输入分类名称' }]}>
            <Input placeholder="例如：外卖" />
          </Form.Item>
          <Form.Item name="icon" label="图标（emoji）">
            <Input placeholder="例如：🍜" />
          </Form.Item>
          <Form.Item name="sort" label="排序值">
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="enabled" label="启用" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
