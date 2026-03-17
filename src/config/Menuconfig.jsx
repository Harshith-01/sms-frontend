import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  BookOutlined,
  SettingOutlined,
  QuestionCircleOutlined,
  PhoneOutlined,
  ReadOutlined,
  ApartmentOutlined,
  ScheduleOutlined,
  SolutionOutlined,
  FileTextOutlined,
  UsergroupAddOutlined,
  ProjectOutlined,
  FileDoneOutlined,
  CheckCircleOutlined,
  BarChartOutlined,
  FormOutlined,
  DollarOutlined,
  CreditCardOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  EditOutlined,
  CalendarOutlined,
  HistoryOutlined,
} from '@ant-design/icons';

// ==================== ADMIN MENU ====================
const getAdminMenu = () => {
  return [
    {
      key: 'dashboard',
      label: 'Dashboard',
      icon: DashboardOutlined,
      path: '/admin/dashboard',
    },
    {
      key: 'students',
      label: 'Students',
      icon: UserOutlined,
      path: '/admin/onboarding/students',
    },
    {
      key: 'teachers',
      label: 'Teachers',
      icon: TeamOutlined,
      path: '/admin/onboarding/teachers',
    },
    {
      key: 'academic',
      label: 'Academic Management',
      icon: BookOutlined,
      children: [
        {
          key: 'academic-years',
          label: 'Academic Years',
          icon: ScheduleOutlined,
          path: '/admin/academic/academic-years',
        },
        {
          key: 'departments',
          label: 'Departments',
          icon: ApartmentOutlined,
          path: '/admin/academic/departments',
        },
        {
          key: 'classes',
          label: 'Classes',
          icon: ReadOutlined,
          path: '/admin/academic/classes',
        },
        {
          key: 'sections',
          label: 'Sections',
          icon: FileTextOutlined,
          path: '/admin/academic/sections',
        },
        {
          key: 'class-sections',
          label: 'Class Sections',
          icon: ProjectOutlined,
          path: '/admin/academic/class-sections',
        },
        {
          key: 'subjects',
          label: 'Subjects',
          icon: BookOutlined,
          path: '/admin/academic/subjects',
        },
        {
          key: 'teaching-assignments',
          label: 'Teaching Assignments',
          icon: SolutionOutlined,
          path: '/admin/academic/teaching-assignments',
        },
        {
          key: 'student-enrollments',
          label: 'Student Enrollments',
          icon: UsergroupAddOutlined,
          path: '/admin/academic/student-enrollments',
        },
      ],
    },
    {
      key: 'attendance',
      label: 'Attendance',
      icon: ClockCircleOutlined,
      children: [
        {
          key: 'timetable-periods',
          label: 'Timetable Periods',
          icon: ScheduleOutlined,
          path: '/admin/attendance/timetable-periods',
        },
        {
          key: 'timetable-entries',
          label: 'Timetable Entries',
          icon: CalendarOutlined,
          path: '/admin/attendance/timetable-entries',
        },
        {
          key: 'attendance-settings',
          label: 'Attendance Settings',
          icon: SettingOutlined,
          path: '/admin/attendance/settings',
        },
        {
          key: 'attendance-reports',
          label: 'Reports',
          icon: BarChartOutlined,
          path: '/admin/attendance/reports',
        },
      ],
    },
    {
      key: 'assessment',
      label: 'Assessment Management',
      icon: FileDoneOutlined,
      children: [
        {
          key: 'grade-scales',
          label: 'Grade Scales',
          icon: BarChartOutlined,
          path: '/admin/assessment/grade-scales',
        },
        {
          key: 'grade-bands',
          label: 'Grade Bands',
          icon: CheckCircleOutlined,
          path: '/admin/assessment/grade-bands',
        },
        {
          key: 'component-weights',
          label: 'Component Weights',
          icon: BarChartOutlined,
          path: '/admin/assessment/component-weights',
        },
        {
          key: 'exams',
          label: 'Exams',
          icon: FileDoneOutlined,
          path: '/admin/assessment/exams',
        },
        {
          key: 'assignments',
          label: 'Assignments',
          icon: FormOutlined,
          path: '/admin/assessment/assignments',
        },
        {
          key: 'exam-marks',
          label: 'Exam Marks',
          icon: CheckCircleOutlined,
          path: '/admin/assessment/exam-marks',
        },
        {
          key: 'assignment-marks',
          label: 'Assignment Marks',
          icon: CheckCircleOutlined,
          path: '/admin/assessment/assignment-marks',
        },
        {
          key: 'report-cards',
          label: 'Report Cards',
          icon: FileDoneOutlined,
          path: '/admin/assessment/report-cards',
        },
      ],
    },
    {
      key: 'fees',
      label: 'Fee Management',
      icon: DollarOutlined,
      children: [
        {
          key: 'student-fees',
          label: 'Student Fees',
          icon: DollarOutlined,
          path: '/admin/fees/student-fees',
        },
        {
          key: 'fee-payments',
          label: 'Fee Payments',
          icon: CreditCardOutlined,
          path: '/admin/fees/fee-payments',
        },
      ],
    },
  ];
};

// ==================== TEACHER MENU ====================
const getTeacherMenu = () => {
  return [
    {
      key: 'dashboard',
      label: 'Dashboard',
      icon: DashboardOutlined,
      path: '/teacher/dashboard',
    },
    {
      key: 'attendance',
      label: 'Attendance',
      icon: CheckCircleOutlined,
      children: [
        {
          key: 'mark-attendance',
          label: 'Mark Attendance',
          icon: CheckCircleOutlined,
          path: '/teacher/attendance/mark',
        },
        {
          key: 'my-sessions',
          label: 'My Sessions',
          icon: HistoryOutlined,
          path: '/teacher/attendance/sessions',
        },
        {
          key: 'class-summary',
          label: 'Class Summary',
          icon: BarChartOutlined,
          path: '/teacher/attendance/summary',
        },
      ],
    },
    {
      key: 'assignments',
      label: 'Assignments',
      icon: FormOutlined,
      path: '/teacher/assignments',
    },
    {
      key: 'exams',
      label: 'Exams',
      icon: FileDoneOutlined,
      path: '/teacher/exams',
    },
    {
      key: 'grading',
      label: 'Grading',
      icon: EditOutlined,
      path: '/teacher/grading',
    },
    {
      key: 'students',
      label: 'My Students',
      icon: UserOutlined,
      path: '/teacher/students',
    },
    {
      key: 'schedule',
      label: 'Class Schedule',
      icon: CalendarOutlined,
      path: '/teacher/schedule',
    },
  ];
};

// ==================== STUDENT MENU ====================
const getStudentMenu = () => {
  return [
    {
      key: 'dashboard',
      label: 'Dashboard',
      icon: DashboardOutlined,
      path: '/student/dashboard',
    },
    {
      key: 'attendance',
      label: 'Attendance',
      icon: ClockCircleOutlined,
      children: [
        {
          key: 'my-attendance',
          label: 'My Attendance',
          icon: CheckCircleOutlined,
          path: '/student/attendance',
        },
        {
          key: 'attendance-history',
          label: 'History',
          icon: HistoryOutlined,
          path: '/student/attendance/history',
        },
      ],
    },
    {
      key: 'assignments',
      label: 'Assignments',
      icon: FormOutlined,
      path: '/student/assignments',
    },
    {
      key: 'exams',
      label: 'Exams',
      icon: FileDoneOutlined,
      path: '/student/exams',
    },
    {
      key: 'report-cards',
      label: 'Report Cards',
      icon: TrophyOutlined,
      path: '/student/report-cards',
    },
    {
      key: 'fees',
      label: 'Fee Status',
      icon: DollarOutlined,
      path: '/student/fees',
    },
    {
      key: 'schedule',
      label: 'Class Schedule',
      icon: CalendarOutlined,
      path: '/student/schedule',
    },
  ];
};

// ==================== MAIN EXPORT ====================
export const getMenuForRole = (role) => {
  if (role === 'admin') {
    return getAdminMenu();
  }

  if (role === 'teacher') {
    return getTeacherMenu();
  }

  if (role === 'student') {
    return getStudentMenu();
  }

  return [];
};

// ==================== BOTTOM MENU ====================
export const getBottomForRole = (role) => {
  return [
    {
      key: 'settings',
      label: 'Settings',
      icon: SettingOutlined,
      path: `/${role}/settings`,
    },
    {
      key: 'help',
      label: 'Help Center',
      icon: QuestionCircleOutlined,
      path: `/${role}/help`,
    },
    {
      key: 'contact',
      label: 'Contact',
      icon: PhoneOutlined,
      path: `/${role}/contact`,
    },
  ];
};