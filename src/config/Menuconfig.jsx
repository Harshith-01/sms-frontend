import {
  DashboardOutlined,
  CalendarOutlined,
  BellOutlined,
  MessageOutlined,
  FileTextOutlined,
  BookOutlined,
  UserOutlined,
  TeamOutlined,
  CheckSquareOutlined,
  DollarOutlined,
  BarChartOutlined,
  UserAddOutlined,
  UsergroupAddOutlined,
  IdcardOutlined,
  FolderOpenOutlined,
  FormOutlined,
  SolutionOutlined,
  TrophyOutlined,
  PayCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';

/* ─────────────────────────────────────
   ADMIN
   ───────────────────────────────────── */
export const adminMenuItems = [
  {
    key: 'a-dashboard',
    icon: DashboardOutlined,
    label: 'Dashboard',
    path: '/admin/dashboard',
  },
  {
    key: 'a-onboarding',
    icon: UserAddOutlined,
    label: 'Onboarding',
    children: [
      {
        key: 'a-onboarding-teachers',
        icon: TeamOutlined,
        label: 'Teachers',
        path: '/admin/onboarding/teachers',
      },
      {
        key: 'a-onboarding-students',
        icon: UserOutlined,
        label: 'Students',
        path: '/admin/onboarding/students',
      },
      {
        key: 'a-onboarding-staff',
        icon: IdcardOutlined,
        label: 'Non-Teaching Staff',
        path: '/admin/onboarding/staff',
      },
    ],
  },
  {
    key: 'a-students',
    icon: UserOutlined,
    label: 'Students',
    path: '/admin/students',
  },
  {
    key: 'a-teachers',
    icon: TeamOutlined,
    label: 'Teachers',
    path: '/admin/teachers',
  },
  {
    key: 'a-classes',
    icon: BookOutlined,
    label: 'Classes',
    path: '/admin/classes',
  },
  {
    key: 'a-attendance',
    icon: CheckSquareOutlined,
    label: 'Attendance',
    path: '/admin/attendance',
  },
  {
    key: 'a-fees',
    icon: DollarOutlined,
    label: 'Fees',
    path: '/admin/fees',
  },
  {
    key: 'a-calendar',
    icon: CalendarOutlined,
    label: 'Calendar',
    path: '/admin/calendar',
  },
  {
    key: 'a-announcements',
    icon: BellOutlined,
    label: 'Announcements',
    path: '/admin/announcements',
  },
  {
    key: 'a-messages',
    icon: MessageOutlined,
    label: 'Messages',
    path: '/admin/messages',
  },
  {
    key: 'a-reports',
    icon: BarChartOutlined,
    label: 'Reports',
    path: '/admin/reports',
  },
  {
    key: 'a-documents',
    icon: FileTextOutlined,
    label: 'Documents',
    path: '/admin/documents',
  },
];

export const adminBottomItems = [
  { key: 'a-settings', icon: 'SettingOutlined', label: 'Settings', path: '/admin/settings' },
  { key: 'a-help', icon: 'QuestionCircleOutlined', label: 'Help Centre', path: '/admin/help' },
  { key: 'a-docs', icon: 'BookOutlined', label: 'Documentation', path: '/admin/docs' },
  { key: 'a-support', icon: 'PhoneOutlined', label: 'Support', path: '/admin/support' },
];

/* ─────────────────────────────────────
   TEACHER
   ───────────────────────────────────── */
export const teacherMenuItems = [
  {
    key: 't-dashboard',
    icon: DashboardOutlined,
    label: 'Dashboard',
    path: '/teacher/dashboard',
  },
  {
    key: 't-my-classes',
    icon: FolderOpenOutlined,
    label: 'My Classes',
    path: '/teacher/my-classes',
  },
  {
    key: 't-students',
    icon: UsergroupAddOutlined,
    label: 'My Students',
    path: '/teacher/students',
  },
  {
    key: 't-attendance',
    icon: CheckSquareOutlined,
    label: 'Attendance',
    path: '/teacher/attendance',
  },
  {
    key: 't-assignments',
    icon: FormOutlined,
    label: 'Assignments',
    path: '/teacher/assignments',
  },
  {
    key: 't-grades',
    icon: BarChartOutlined,
    label: 'Grades',
    path: '/teacher/grades',
  },
];

/* ─────────────────────────────────────
   STUDENT
   ───────────────────────────────────── */
export const studentMenuItems = [
  {
    key: 's-dashboard',
    icon: DashboardOutlined,
    label: 'Dashboard',
    path: '/student/dashboard',
  },
  {
    key: 's-courses',
    icon: SolutionOutlined,
    label: 'My Courses',
    path: '/student/courses',
  },
  {
    key: 's-assignments',
    icon: FormOutlined,
    label: 'Assignments',
    path: '/student/assignments',
  },
  {
    key: 's-grades',
    icon: TrophyOutlined,
    label: 'Grades',
    path: '/student/grades',
  },
  {
    key: 's-attendance',
    icon: CheckSquareOutlined,
    label: 'Attendance',
    path: '/student/attendance',
  },
  {
    key: 's-fees',
    icon: PayCircleOutlined,
    label: 'Fees',
    path: '/student/fees',
  },
  {
    key: 's-timetable',
    icon: ClockCircleOutlined,
    label: 'Timetable',
    path: '/student/timetable',
  },
];

const mainMap = {
  admin: adminMenuItems,
  teacher: teacherMenuItems,
  student: studentMenuItems,
};

const bottomMap = {
  admin: adminBottomItems,
};

export const getMenuForRole = (role) => mainMap[role] || mainMap.admin;
export const getBottomForRole = (role) => bottomMap[role] || bottomMap.admin;
