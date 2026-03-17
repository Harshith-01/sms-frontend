import { Layout, Menu, Tooltip } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  SettingOutlined,
  QuestionCircleOutlined,
  BookOutlined,
  PhoneOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { getMenuForRole, getBottomForRole } from '../../config/MenuConfig';
import './Sidebar.css';

const { Sider } = Layout;

/* icon-name → component (for bottom items only) */
const ICON_MAP = {
  SettingOutlined,
  QuestionCircleOutlined,
  BookOutlined,
  PhoneOutlined,
};

const ROLE_LABELS = {
  admin: 'Admin',
  teacher: 'Teacher',
  student: 'Student',
};

export default function Sidebar({ collapsed, setCollapsed, role = 'admin' }) {
  const navigate = useNavigate();
  const location = useLocation();

  const mainItems = getMenuForRole(role);
  const bottomItems = getBottomForRole(role);

  /* ─────────────────────────────────────────
     Build AntD menu items (supports children)
     ───────────────────────────────────────── */
  const buildMenuItems = (items) =>
    items.map((item) => {
      if (item.children) {
        return {
          key: item.key,
          icon: <item.icon style={{ fontSize: 20 }} />,
          label: item.label,
          children: buildMenuItems(item.children),
        };
      }

      return {
        key: item.key,
        icon: <item.icon style={{ fontSize: 20 }} />,
        label: item.label,
        onClick: () => navigate(item.path),
      };
    });

  const menuItems = buildMenuItems(mainItems);

  /* ─────────────────────────────────────────
     Find active menu key (recursive)
     ───────────────────────────────────────── */
  const findActiveKey = (items, pathname) => {
    for (const item of items) {
      if (item.path && pathname.startsWith(item.path)) {
        return item.key;
      }
      if (item.children) {
        const childKey = findActiveKey(item.children, pathname);
        if (childKey) return childKey;
      }
    }
    return null;
  };

  const currentKey =
    findActiveKey(mainItems, location.pathname) || mainItems[0]?.key;

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      trigger={null}
      width={240}
      collapsedWidth={70}
      className="dashboard-sidebar"
      onMouseEnter={() => setCollapsed(false)}
      onMouseLeave={() => setCollapsed(true)}
    >
      {/* ── Logo ── */}
      <div className="sidebar-logo">
        {collapsed ? (
          <div className="logo-icon">🎓</div>
        ) : (
          <div className="logo-full">
            <span>🎓</span>
            <span className="logo-text">SchooolMS</span>
          </div>
        )}
      </div>

      {/* ── Main Menu ── */}
      <Menu
        mode="inline"
        selectedKeys={[currentKey]}
        items={menuItems}
        inlineCollapsed={collapsed}
        className="sidebar-menu"
      />

      {/* ── Bottom Section ── */}
      <div className="sidebar-bottom">
        <div className="bottom-divider" />

        {bottomItems.map((item) => {
          const Icon = ICON_MAP[item.icon] || SettingOutlined;
          const active = currentKey === item.key;

          const button = (
            <div
              key={item.key}
              className={`bottom-item ${active ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <Icon className="bottom-item-icon" />
              {!collapsed && (
                <span className="bottom-item-label">{item.label}</span>
              )}
            </div>
          );

          return collapsed ? (
            <Tooltip key={item.key} placement="right" title={item.label}>
              {button}
            </Tooltip>
          ) : (
            button
          );
        })}

        {/* ── User Pill ── */}
        <div className="sidebar-user-pill">
          <div className="user-pill-avatar">
            <UserOutlined />
          </div>
          {!collapsed && (
            <div className="user-pill-text">
              <span className="user-pill-name">Luke J R</span>
              <span className="user-pill-role">
                {ROLE_LABELS[role] || 'User'}
              </span>
            </div>
          )}
        </div>
      </div>
    </Sider>
  );
}
