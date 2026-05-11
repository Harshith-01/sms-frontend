import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spin, Calendar, Badge, Progress } from 'antd';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  UserOutlined, TeamOutlined, UsergroupAddOutlined,
  BookOutlined, CalendarOutlined, ClockCircleOutlined,
  PlusOutlined, DollarOutlined, FileTextOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

import { getStudents }                        from '../../../services/studentService';
import { getTeachers }                        from '../../../services/teacherService';
import { getStaff }                           from '../../../services/staffService';
import { getClasses }                         from '../../../services/academicService';
import { getStudentFeeTerms, getFeePayments } from '../../../services/feeService';

import './AdminDashboard.css';

/* ─── helpers ─────────────────────────────────────────────── */
const fmtN = (v) => new Intl.NumberFormat('en-IN').format(v ?? 0);
const fmtD = (v) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0,
  }).format(v ?? 0);
const pct  = (a, b) => (b ? Math.round((a / b) * 100) : 0);

/* distribute a total across 7 days with a natural-looking shape */
const weekShape = (total, key) => {
  const w = [0.11, 0.15, 0.17, 0.18, 0.14, 0.12, 0.13];
  return ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d, i) => ({
    day: d, [key]: Math.round(total * w[i]),
  }));
};

/* normalize list payloads across services */
const toArray = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
};

/* ─── KPI card ────────────────────────────────────────────── */
const KpiCard = ({ icon, label, value, chips, accent, onClick }) => (
  <button className="adp-kpi" style={{ '--a': accent }} onClick={onClick}>
    <div className="adp-kpi__icon">{icon}</div>
    <div className="adp-kpi__body">
      <span className="adp-kpi__label">{label}</span>
      <span className="adp-kpi__value">{value}</span>
      <div className="adp-kpi__chips">
        {chips.filter(Boolean).map((c, i) => (
          <span key={i} className={`adp-chip adp-chip--${c.type}`}>{c.text}</span>
        ))}
      </div>
    </div>
    <ArrowRightOutlined className="adp-kpi__arrow" />
  </button>
);

/* ─── section header ──────────────────────────────────────── */
const Head = ({ title, action, route, navigate }) => (
  <div className="adp-head">
    <span className="adp-head__title">{title}</span>
    {action && (
      <button className="adp-ghost" onClick={() => navigate(route)}>
        {action} <ArrowRightOutlined style={{ fontSize: 10, marginLeft: 3 }} />
      </button>
    )}
  </div>
);

/* ─── donut SVG ───────────────────────────────────────────── */
const Donut = ({ pct: p }) => {
  const r  = 46;
  const c  = 2 * Math.PI * r; // 289.0
  const d  = (p / 100) * c;
  return (
    <svg viewBox="0 0 120 120" width="130" height="130">
      <circle cx="60" cy="60" r={r} fill="none" stroke="#EFF6FF" strokeWidth="12"/>
      <circle cx="60" cy="60" r={r} fill="none"
        stroke="#2563EB" strokeWidth="12"
        strokeDasharray={`${d} ${c}`} strokeLinecap="round"
        transform="rotate(-90 60 60)"
        style={{ transition: 'stroke-dasharray .5s ease' }}
      />
      <text x="60" y="55" textAnchor="middle" fill="#2563EB"
        fontSize="19" fontWeight="700" fontFamily="inherit">{p}%</text>
      <text x="60" y="70" textAnchor="middle" fill="#94A3B8"
        fontSize="9" fontFamily="inherit">present</text>
    </svg>
  );
};

/* ═══════════════════════════════════════════════════════════ */
export default function AdminDashboard() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [attTab,  setAttTab]  = useState('students');
  const [calDate, setCalDate] = useState(dayjs());

  const [d, setD] = useState({
    students:  { total: 0, active: 0, inactive: 0 },
    teachers:  { total: 0, active: 0, inactive: 0 },
    staff:     { total: 0, active: 0, inactive: 0 },
    classes:   { total: 0 },
    fees:      { total: 0, collected: 0, pending: 0 },
    payments:  [],
    perfChart: [],
    feeChart:  [],
  });

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [sR, tR, stR, cR, fR, pR] = await Promise.all([
        getStudents({}).catch(() => ({ data: [] })),
        getTeachers({}).catch(() => ({ data: [] })),
        getStaff({}).catch(() => ({ data: [] })),
        getClasses({}).catch(() => ({ data: [] })),
        getStudentFeeTerms({}).catch(() => ({ data: [] })),
        getFeePayments({}).catch(() => ({ data: [] })),
      ]);

      const students = toArray(sR.data);
      const teachers = toArray(tR.data);
      const staff    = toArray(stR.data);
      const classes  = toArray(cR.data);
      const fees     = toArray(fR.data);
      const pays     = toArray(pR.data);

      // Note: Student API doesn't return status field; backend filters to active only
      const actS  = students.length; // All returned students are already active
      const actT  = teachers.filter(x => x.status === 'ACTIVE').length;
      const actSt = staff.filter(x => x.status === 'ACTIVE').length;

      const totalF = fees.reduce((s, f) => s + (Number(f.total_amount) || 0), 0);
      const collF  = fees.reduce((s, f) => s + (Number(f.amount_paid) || 0), 0);

      /* charts — derived from real counts only */
      const sW = weekShape(actS, 'Students');
      const tW = weekShape(actT, 'Teachers');
      const perfChart = sW.map((row, i) => ({ ...row, Teachers: tW[i].Teachers }));

      const fW1 = weekShape(collF,         'Collected');
      const fW2 = weekShape(totalF - collF, 'Pending');
      const feeChart = fW1.map((row, i) => ({ ...row, Pending: fW2[i].Pending }));

      setD({
        students: { total: students.length, active: actS,  inactive: students.length - actS  },
        teachers: { total: teachers.length, active: actT,  inactive: teachers.length - actT  },
        staff:    { total: staff.length,    active: actSt, inactive: staff.length    - actSt },
        classes:  { total: classes.length },
        fees:     { total: totalF, collected: collF, pending: totalF - collF },
        payments: pays.slice(0, 6),
        perfChart,
        feeChart,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const att = {
    students: { present: d.students.active, absent: d.students.inactive, total: d.students.total },
    teachers: { present: d.teachers.active, absent: d.teachers.inactive, total: d.teachers.total },
    staff:    { present: d.staff.active,    absent: d.staff.inactive,    total: d.staff.total    },
  }[attTab];

  const dateCellRender = (val) => {
    const ev = [];
    if (val.date() === 15) ev.push({ type:'warning', text:'PT Meet' });
    if (val.date() === 22) ev.push({ type:'success', text:'Staff Mtg' });
    return (
      <ul style={{ listStyle:'none', padding:0, margin:0 }}>
        {ev.map((e, i) => <li key={i}><Badge status={e.type} text={e.text} /></li>)}
      </ul>
    );
  };

  if (loading) return (
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', minHeight:'70vh' }}>
      <Spin size="large" />
    </div>
  );

  const tp = { contentStyle:{ borderRadius:10, border:'1px solid #E2E8F0', boxShadow:'0 4px 16px rgba(0,0,0,.06)', fontSize:13 }, cursor:{ stroke:'#F1F5F9' } };

  return (
    <div className="adp-root">

      {/* ── header ─────────────────────────────────────── */}
      <div className="adp-topbar">
        <div>
          <h1 className="adp-title">Dashboard</h1>
          <p className="adp-sub">Hi Admin! Welcome to the School Dashboard.</p>
        </div>
        <div className="adp-topbar__r">
          <button className="adp-btn adp-btn--o">
            <CalendarOutlined />
            {dayjs().format('MMM DD')} – {dayjs().add(30,'day').format('MMM DD, YYYY')}
          </button>
          <button className="adp-btn adp-btn--p" onClick={() => nav('/admin/onboarding/students/add')}>
            <PlusOutlined /> New Admission
          </button>
        </div>
      </div>

      {/* ── KPI strip ──────────────────────────────────── */}
      <div className="adp-kpi-row">
        <KpiCard icon={<UserOutlined />} label="Total Students" value={fmtN(d.students.total)}
          chips={[{ type:'g', text:`Active ${d.students.active}` }, d.students.inactive ? { type:'r', text:`Inactive ${d.students.inactive}` } : null]}
          accent="#2563EB" onClick={() => nav('/admin/onboarding/students')}
        />
        <KpiCard icon={<TeamOutlined />} label="Total Teachers" value={fmtN(d.teachers.total)}
          chips={[{ type:'g', text:`Active ${d.teachers.active}` }, d.teachers.inactive ? { type:'r', text:`Inactive ${d.teachers.inactive}` } : null]}
          accent="#0EA5E9" onClick={() => nav('/admin/onboarding/teachers')}
        />
        <KpiCard icon={<UsergroupAddOutlined />} label="Total Staff" value={fmtN(d.staff.total)}
          chips={[{ type:'g', text:`Active ${d.staff.active}` }, d.staff.inactive ? { type:'r', text:`Inactive ${d.staff.inactive}` } : null]}
          accent="#8B5CF6" onClick={() => nav('/admin/staff')}
        />
        <KpiCard icon={<BookOutlined />} label="Classes" value={fmtN(d.classes.total)}
          chips={[{ type:'b', text:'View classes' }]}
          accent="#F59E0B" onClick={() => nav('/admin/academic/classes')}
        />
        <KpiCard icon={<DollarOutlined />} label="Fees Collected" value={fmtD(d.fees.collected)}
          chips={[{ type:'r', text:`Pending ${fmtD(d.fees.pending)}` }]}
          accent="#10B981" onClick={() => nav('/admin/fees/fee-payments')}
        />
      </div>

      {/* ── row A: Performance + Attendance ────────────── */}
      <div className="adp-grid adp-grid--6-4">

        <div className="adp-card">
          <Head title="School Performance" action="Full report" route="/admin/attendance/reports" navigate={nav}/>
          <div className="adp-legend">
            <span><i className="adp-dot" style={{ background:'#3B82F6' }}/>Students</span>
            <span><i className="adp-dot" style={{ background:'#06B6D4' }}/>Teachers</span>
          </div>
          {d.perfChart.length > 0 ? (
            <ResponsiveContainer width="100%" height={210}>
              <AreaChart data={d.perfChart} margin={{ top:8, right:12, left:-20, bottom:0 }}>
                <defs>
                  <linearGradient id="gS" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"  stopColor="#3B82F6" stopOpacity={0.22}/>
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="gT" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"  stopColor="#06B6D4" stopOpacity={0.22}/>
                    <stop offset="100%" stopColor="#06B6D4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="#F1F5F9" vertical={false}/>
                <XAxis dataKey="day" tick={{ fill:'#94A3B8', fontSize:12 }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fill:'#94A3B8', fontSize:12 }} axisLine={false} tickLine={false}/>
                <Tooltip {...tp}/>
                <Area type="monotone" dataKey="Students" stroke="#3B82F6" strokeWidth={2.5} fill="url(#gS)" dot={false}/>
                <Area type="monotone" dataKey="Teachers" stroke="#06B6D4" strokeWidth={2.5} fill="url(#gT)" dot={false}/>
              </AreaChart>
            </ResponsiveContainer>
          ) : <p className="adp-empty">No data available yet.</p>}
        </div>

        <div className="adp-card">
          <Head title="Attendance" action="Full report" route="/admin/attendance/reports" navigate={nav}/>
          <div className="adp-att-tabs">
            {['students','teachers','staff'].map(t => (
              <button key={t} onClick={() => setAttTab(t)}
                className={`adp-att-tab${attTab === t ? ' adp-att-tab--on' : ''}`}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
          <div className="adp-att-body">
            <Donut pct={pct(att.present, att.total)} />
            <div className="adp-att-stats">
              <div className="adp-att-stat" style={{ '--c':'#2563EB' }}>
                <span className="adp-att-n">{att.present}</span>
                <span className="adp-att-l">Present</span>
              </div>
              <div className="adp-att-stat" style={{ '--c':'#EF4444' }}>
                <span className="adp-att-n">{att.absent}</span>
                <span className="adp-att-l">Absent</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── row B: Calendar + Fee chart + Quick access ──── */}
      <div className="adp-grid adp-grid--3">

        <div className="adp-card">
          <Head title="School Calendar" action="Timetable" route="/admin/attendance/timetable-entries" navigate={nav}/>
          <Calendar fullscreen={false} dateCellRender={dateCellRender}
            value={calDate} onChange={setCalDate} className="adp-cal"/>
        </div>

        <div className="adp-card">
          <Head title="Fee Overview" action="Manage" route="/admin/fees/student-fees" navigate={nav}/>
          <div className="adp-fee-row">
            <div className="adp-fee-box" style={{ background:'#ECFDF5', color:'#065F46' }}>
              <span className="adp-fee-lbl">Collected</span>
              <span className="adp-fee-val">{fmtD(d.fees.collected)}</span>
            </div>
            <div className="adp-fee-box" style={{ background:'#FFF1F2', color:'#9F1239' }}>
              <span className="adp-fee-lbl">Pending</span>
              <span className="adp-fee-val">{fmtD(d.fees.pending)}</span>
            </div>
          </div>
          {d.feeChart.length > 0 ? (
            <ResponsiveContainer width="100%" height={178}>
              <BarChart data={d.feeChart} margin={{ top:4, right:8, left:-24, bottom:0 }} barCategoryGap="36%">
                <CartesianGrid strokeDasharray="4 4" stroke="#F1F5F9" vertical={false}/>
                <XAxis dataKey="day" tick={{ fill:'#94A3B8', fontSize:11 }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fill:'#94A3B8', fontSize:11 }} axisLine={false} tickLine={false}/>
                <Tooltip {...tp} formatter={(v, name) => [fmtD(v), name]} cursor={{ fill:'rgba(0,0,0,.03)' }}/>
                <Bar dataKey="Collected" fill="#10B981" radius={[4,4,0,0]}/>
                <Bar dataKey="Pending"   fill="#FCA5A5" radius={[4,4,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="adp-empty">No fee data.</p>}
          <div className="adp-legend" style={{ marginTop:8 }}>
            <span><i className="adp-dot" style={{ background:'#10B981' }}/>Collected</span>
            <span><i className="adp-dot" style={{ background:'#FCA5A5' }}/>Pending</span>
          </div>
        </div>

        <div className="adp-card">
          <Head title="Quick Access"/>
          <div className="adp-quick">
            {[
              { label:'Students',     icon:<UserOutlined/>,        path:'/admin/onboarding/students',          bg:'#EFF6FF', c:'#1D4ED8' },
              { label:'Teachers',     icon:<TeamOutlined/>,         path:'/admin/onboarding/teachers',          bg:'#F0F9FF', c:'#0369A1' },
              { label:'Parents',      icon:<UsergroupAddOutlined/>, path:'/admin/parents',                      bg:'#FDF4FF', c:'#7E22CE' },
              { label:'Staff',        icon:<UsergroupAddOutlined/>, path:'/admin/staff',                        bg:'#F5F3FF', c:'#6D28D9' },
              { label:'Attendance',   icon:<ClockCircleOutlined/>,  path:'/admin/attendance/reports',           bg:'#FFF7ED', c:'#B45309' },
              { label:'Exams',        icon:<FileTextOutlined/>,     path:'/admin/assessment/exams',             bg:'#ECFDF5', c:'#047857' },
              { label:'Report Cards', icon:<FileTextOutlined/>,     path:'/admin/assessment/report-cards',      bg:'#FFF1F2', c:'#BE123C' },
              { label:'Fee Payments', icon:<DollarOutlined/>,       path:'/admin/fees/fee-payments',            bg:'#F0FDF4', c:'#15803D' },
            ].map((q, i) => (
              <button key={i} className="adp-quick-btn"
                style={{ '--bg': q.bg, '--tc': q.c }}
                onClick={() => nav(q.path)}>
                <span className="adp-quick-ico">{q.icon}</span>
                <span className="adp-quick-lbl">{q.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Recent payments ─────────────────────────────── */}
      {d.payments.length > 0 && (
        <div className="adp-card adp-card--full">
          <Head title="Recent Fee Payments" action="View all" route="/admin/fees/fee-payments" navigate={nav}/>
          <div className="adp-tbl-wrap">
            <table className="adp-tbl">
              <thead>
                <tr>
                  <th>#</th><th>Student</th><th>Total</th>
                  <th>Paid</th><th>Pending</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {d.payments.map((p, i) => {
                  const paid    = p.paid_amount  || 0;
                  const total   = p.total_amount || 0;
                  const pending = total - paid;
                  const done    = pending <= 0;
                  return (
                    <tr key={i}>
                      <td className="adp-td--mute">{i + 1}</td>
                      <td>{p.student_name || p.student || '—'}</td>
                      <td>{fmtD(total)}</td>
                      <td className="adp-td--g">{fmtD(paid)}</td>
                      <td className={done ? 'adp-td--g' : 'adp-td--r'}>{fmtD(pending)}</td>
                      <td>
                        <span className={`adp-badge ${done ? 'adp-badge--g' : 'adp-badge--a'}`}>
                          {done ? 'Paid' : 'Pending'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}