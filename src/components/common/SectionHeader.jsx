import './SectionHeader.css';

export default function SectionHeader({ title, action }) {
  return (
    <div className="section-header">
      <h2 className="section-header-title">{title}</h2>
      {action && <div className="section-header-action">{action}</div>}
    </div>
  );
}