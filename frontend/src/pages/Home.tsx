import { Button, Col, Rate, Row, Tag, Typography } from 'antd';
import {
  AppleOutlined,
  CoffeeOutlined,
  MedicineBoxOutlined,
  RightOutlined,
  ShopOutlined,
  ShoppingOutlined,
} from '@ant-design/icons';
import UnifiedCard from '../components/UnifiedCard';

const { Title, Text } = Typography;

const categories = [
  { id: 'waimai', icon: <ShopOutlined />, label: '外卖' },
  { id: 'food', icon: <CoffeeOutlined />, label: '到店美食' },
  { id: 'market', icon: <ShoppingOutlined />, label: '超市便利' },
  { id: 'fruit', icon: <AppleOutlined />, label: '果蔬生鲜' },
  { id: 'medicine', icon: <MedicineBoxOutlined />, label: '买药' },
];

interface Shop {
  name: string;
  score: number;
  tags: string[];
  price: number;
  time: string;
  distance: string;
  emoji: string;
}

const shopsByCity: Record<string, Shop[]> = {
  北京: [
    { name: '老北京炸酱面馆', score: 4.8, tags: ['面食', '京味'], price: 28, time: '30分钟', distance: '1.2km', emoji: '🍜' },
    { name: '胡同里铜锅涮肉', score: 4.9, tags: ['火锅', '铜锅'], price: 118, time: '40分钟', distance: '2.0km', emoji: '🍲' },
    { name: '稻香村糕点铺', score: 4.7, tags: ['糕点', '伴手礼'], price: 35, time: '25分钟', distance: '800m', emoji: '🥮' },
    { name: '京味烤鸭坊', score: 4.9, tags: ['烤鸭', '聚餐'], price: 158, time: '45分钟', distance: '3.1km', emoji: '🦆' },
    { name: '三里屯轻食沙拉', score: 4.6, tags: ['轻食', '健康'], price: 32, time: '20分钟', distance: '1.5km', emoji: '🥗' },
    { name: '国贸便利店', score: 4.5, tags: ['24小时', '零食'], price: 15, time: '15分钟', distance: '500m', emoji: '🏪' },
  ],
  上海: [
    { name: '弄堂小馄饨', score: 4.8, tags: ['馄饨', '早餐'], price: 18, time: '20分钟', distance: '600m', emoji: '🥟' },
    { name: '本帮红烧肉小馆', score: 4.9, tags: ['本帮菜', '下饭'], price: 68, time: '35分钟', distance: '1.8km', emoji: '🍖' },
    { name: '外滩咖啡', score: 4.7, tags: ['咖啡', '甜品'], price: 28, time: '15分钟', distance: '900m', emoji: '☕' },
    { name: '上海生煎大王', score: 4.8, tags: ['生煎', '小吃'], price: 22, time: '25分钟', distance: '1.1km', emoji: '🥟' },
    { name: '静安轻食工坊', score: 4.6, tags: ['轻食', '健康'], price: 36, time: '22分钟', distance: '1.4km', emoji: '🥗' },
    { name: '静安便利店', score: 4.5, tags: ['24小时', '零食'], price: 14, time: '12分钟', distance: '400m', emoji: '🏪' },
  ],
  广州: [
    { name: '早茶点心楼', score: 4.9, tags: ['早茶', '点心'], price: 58, time: '30分钟', distance: '1.6km', emoji: '🥟' },
    { name: '煲仔饭老铺', score: 4.8, tags: ['煲仔饭', '快餐'], price: 30, time: '28分钟', distance: '1.2km', emoji: '🍚' },
    { name: '烧腊双拼店', score: 4.7, tags: ['烧腊', '下饭'], price: 32, time: '20分钟', distance: '900m', emoji: '🍗' },
    { name: '老广糖水铺', score: 4.8, tags: ['糖水', '甜品'], price: 16, time: '18分钟', distance: '700m', emoji: '🍧' },
    { name: '粤式肠粉王', score: 4.9, tags: ['肠粉', '早餐'], price: 15, time: '15分钟', distance: '500m', emoji: '🥢' },
    { name: '天河便利店', score: 4.5, tags: ['24小时', '零食'], price: 13, time: '10分钟', distance: '350m', emoji: '🏪' },
  ],
  深圳: [
    { name: '潮汕牛肉火锅', score: 4.9, tags: ['火锅', '潮汕'], price: 98, time: '35分钟', distance: '2.2km', emoji: '🥩' },
    { name: '猪脚饭快餐', score: 4.6, tags: ['快餐', '猪脚饭'], price: 22, time: '18分钟', distance: '800m', emoji: '🍛' },
    { name: '四季椰子鸡', score: 4.8, tags: ['椰子鸡', '聚餐'], price: 88, time: '40分钟', distance: '2.8km', emoji: '🥥' },
    { name: '南山轻食沙拉', score: 4.7, tags: ['轻食', '健康'], price: 30, time: '20分钟', distance: '1.0km', emoji: '🥗' },
    { name: '深圳糖水铺', score: 4.6, tags: ['糖水', '甜品'], price: 18, time: '16分钟', distance: '900m', emoji: '🍧' },
    { name: '科技园便利店', score: 4.5, tags: ['24小时', '零食'], price: 12, time: '12分钟', distance: '450m', emoji: '🏪' },
  ],
};

export default function Home({ city }: { city: string }) {
  const shops = shopsByCity[city] ?? [];

  return (
    <div className="home">
      <div className="home-inner">
        <section className="hero-section">
          <div className="hero">
            <Title level={2}>今天想吃什么？</Title>
            <Text className="hero-sub">当前城市 · {city}</Text>
            <Button type="primary" size="large" className="hero-btn">
              开始点餐
            </Button>
          </div>
        </section>

        <section className="category-section">
          <UnifiedCard hoverable={false} className="category-card">
            <div className="category-grid">
              {categories.map((c) => (
                <div className="category-item" key={c.id}>
                  <span className="category-icon">{c.icon}</span>
                  <span className="category-label">{c.label}</span>
                </div>
              ))}
            </div>
          </UnifiedCard>
        </section>

        <section className="recommend-section">
          <div className="section-head">
            <div>
              <Title level={4}>为你推荐</Title>
              <Text type="secondary">{city}附近的好店，都在这里</Text>
            </div>
            <Button type="link">
              查看全部 <RightOutlined />
            </Button>
          </div>

          <Row gutter={[20, 20]}>
            {shops.map((s) => (
              <Col xs={24} sm={12} md={8} key={s.name}>
                <UnifiedCard
                  className="shop-card"
                  cover={
                    <div className="shop-cover">
                      <span className="shop-emoji">{s.emoji}</span>
                    </div>
                  }
                >
                  <div className="shop-title">{s.name}</div>
                  <div className="shop-meta">
                    <Rate disabled allowHalf defaultValue={s.score} className="shop-rate" />
                    <span className="shop-score">{s.score}</span>
                    <span className="shop-distance">· {s.distance}</span>
                  </div>
                  <div className="shop-tags">
                    {s.tags.map((t) => (
                      <Tag key={t} bordered={false}>
                        {t}
                      </Tag>
                    ))}
                  </div>
                  <div className="shop-bottom">
                    <span className="shop-price">
                      <span className="price-symbol">¥</span>
                      {s.price}
                      <span className="price-unit">起</span>
                    </span>
                    <span className="shop-time">{s.time}</span>
                  </div>
                </UnifiedCard>
              </Col>
            ))}
          </Row>
        </section>
      </div>
    </div>
  );
}
