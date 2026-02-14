import { Card } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import './QuickActionCard.css';

export default function QuickActionCard({ title, icon, color = '#5B7FFF', onClick }) {
  return (
    <Card 
      className="quick-action-card" 
      variant="borderless"
      onClick={onClick}
      hoverable
    >
      <div className="action-card-content">
        <div className="action-icon" style={{ background: `${color}15`, color: color }}>
          {icon}
        </div>
        <div className="action-title">{title}</div>
        <div className="action-button" style={{ background: `${color}15`, color: color }}>
          <PlusOutlined />
        </div>
      </div>
    </Card>
  );
}