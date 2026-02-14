import { Card } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import './StatCard.css';

export default function StatCard({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue, 
  color = '#5B7FFF',
  suffix = ''
}) {
  const isPositive = trend === 'up';

  return (
    <Card className="stat-card" variant="borderless">
      <div className="stat-card-content">
        <div className="stat-info">
          <div className="stat-title">{title}</div>
          <div className="stat-value">
            {value}
            {suffix && <span className="stat-suffix">{suffix}</span>}
          </div>
          {trendValue && (
            <div className={`stat-trend ${isPositive ? 'positive' : 'negative'}`}>
              {isPositive ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
              <span>{trendValue}% vs last month</span>
            </div>
          )}
        </div>
        <div className="stat-icon" style={{ background: `${color}15`, color: color }}>
          {icon}
        </div>
      </div>
    </Card>
  );
}