import { useState } from 'react';
import { Layout } from 'antd';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../../components/topbar/Topbar';
import Sidebar from '../../components/sidebar/Sidebar';
import './DashboardLayout.css';

const { Content } = Layout;

/* extract "admin" | "teacher" | "student" from /admin/…  /teacher/… etc */
function deriveRole(pathname) {
  const first = pathname.split('/').filter(Boolean)[0]; // e.g. "admin"
  return ['admin', 'teacher', 'student'].includes(first) ? first : 'admin';
}

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(true);
  const location                  = useLocation();
  const role                      = deriveRole(location.pathname);

  return (
    <Layout className="dashboard-layout">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} role={role} />

      <Layout
        className="main-layout"
        style={{ marginLeft: collapsed ? 70 : 240 }}
      >
        <Navbar collapsed={collapsed} />

        <Content className="main-content">
          <div className="content-wrapper">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}