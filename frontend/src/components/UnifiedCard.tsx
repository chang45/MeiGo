import { Card } from 'antd';
import type { CardProps } from 'antd';
import './UnifiedCard.css';

export type UnifiedCardProps = CardProps;

/**
 * 全局统一卡片：所有卡片统一圆角、阴影、悬浮效果。
 * 业务卡片直接复用，不要在各自页面重复写基础卡片样式。
 */
export default function UnifiedCard({ hoverable = true, className, ...props }: UnifiedCardProps) {
  const cls = ['unified-card', className].filter(Boolean).join(' ');
  return <Card bordered={false} hoverable={hoverable} className={cls} {...props} />;
}
