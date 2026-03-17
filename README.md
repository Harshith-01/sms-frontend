# School ERP - Academic Operations Frontend

## Overview

**Academic Operations Frontend** is the React-based user interface for the School ERP system, providing comprehensive management of academic activities, assessments, fee collection, and attendance tracking. It connects to four backend microservices: `academic-service`, `assessment-service`, `fees-service`, and `attendance-service`.

**Base URL (local):** http://localhost:5173  
**API Gateway:** http://127.0.0.1:8000 (or configured backend URL)  
**Tech Stack:** React 18, Ant Design 5, React Router 6, Axios

---

## Core Capabilities

### 📚 Academic Management
- Academic year and term configuration
- Department and class structure
- Section management and class-section mapping
- Subject catalog and curriculum
- Teaching assignment workflows
- Student enrollment tracking

### 📊 Assessment Management
- Grade scale and grade band configuration
- Component weight distribution (exam/assignment/attendance)
- Exam lifecycle (creation, publication, cancellation)
- Assignment lifecycle (creation, submission, marking)
- Bulk marks upload with row-level validation
- Report card generation and publication
- Student academic history and progress tracking

### 💰 Fee Management
- Student fee term configuration
- Payment recording and ledger tracking
- Multiple payment method support (Cash, Card, Online, Cheque)
- Payment status monitoring (Paid, Partial, Pending)
- Fee summary and analytics

### 📅 Attendance & Timetable
- Timetable period and entry configuration
- Attendance settings and validation rules
- Daily attendance marking (bulk and individual)
- Session locking and correction windows
- School-wide and class-level analytics
- Student attendance dashboards with calendar view

---

## Security Model

- **JWT Bearer Token Authentication:** All API requests include `Authorization: Bearer <token>`
- **Role-Based Access Control:** Routes protected by user role (ADMIN, TEACHER, STUDENT)
- **Context-Based Auth:** React Context API manages authentication state
- **Protected Routes:** Automatic redirect to login for unauthenticated users
- **Token Refresh:** Automatic token renewal on expiry
- **HTTPS Only:** Production deployment enforces secure connections

**Supported Roles:**
- `ADMIN` - Full access to all modules
- `TEACHER` - Attendance marking, grade submission (limited)
- `STUDENT` - View-only access to personal data

---

## API Integration

All services communicate via RESTful APIs with JSON payloads.

### Service Endpoints

#### Academic Service
```
Base: /academic
GET    /academic-years
POST   /academic-years
PUT    /academic-years/{id}
DELETE /academic-years/{id}

GET    /departments
POST   /departments
PUT    /departments/{id}
DELETE /departments/{id}

GET    /classes, /sections, /class-sections, /subjects
POST   /teaching-assignments, /student-enrollments
...
```

#### Assessment Service
```
Base: /assessment
GET    /grade-scales
POST   /grade-scales
PUT    /grade-scales/{scale_id}
DELETE /grade-scales/{scale_id}

GET    /exams
POST   /exams
PATCH  /exams/{exam_id}/publish
PATCH  /exams/{exam_id}/cancel

POST   /assignments
PATCH  /assignments/{assignment_id}/publish
POST   /assignments/marks/bulk
PATCH  /assignment-marks/{submission_id}/verify

POST   /report-cards/generate
GET    /report-cards/student/{student_id}

GET    /history/student/{student_id}/exam
GET    /progress/student/{student_id}
...
```

#### Fees Service
```
Base: /fees
POST   /term
GET    /student/{student_id}
POST   /term/{term_id}/pay
GET    /term/{term_id}/payments
GET    /student/{student_id}/summary
...
```

#### Attendance Service
```
Base: /timetable-attendance
GET    /periods
POST   /periods
GET    /entries/class/{id}
POST   /entries

POST   /attendance/sessions
POST   /attendance/sessions/{id}/absences/bulk
GET    /attendance/students/{id}/history
GET    /attendance/analytics/class/{id}
GET    /attendance/analytics/school
...
```

---

## Project Structure

```
src/
├── components/
│   ├── layouts/
│   │   ├── DashboardLayout.jsx       # Main dashboard wrapper
│   │   └── AuthLayout.jsx            # Login/register wrapper
│   └── shared/                       # Reusable components
├── pages/
│   ├── auth/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── ForgotPassword.jsx
│   └── dashboard/
│       ├── admin/
│       │   ├── academic/             # 8 pages
│       │   ├── assessment/           # 8 pages
│       │   ├── fees/                 # 2 pages
│       │   └── attendance/           # 4 pages
│       ├── teacher/
│       │   └── attendance/           # 3 pages
│       └── student/
│           └── attendance/           # 2 pages
├── services/
│   ├── api.js                        # Axios instance with interceptors
│   ├── academicService.js            # Academic API calls
│   ├── assessmentService.js          # Assessment API calls
│   ├── feeService.js                 # Fee API calls
│   └── attendanceService.js          # Attendance API calls
├── contexts/
│   └── AuthContext.jsx               # Global auth state
├── config/
│   └── MenuConfig.js                 # Role-based menu configuration
├── routes/
│   └── AppRoutes.jsx                 # Route definitions
├── App.jsx
└── main.jsx
```

---

## Local Development

### Prerequisites
- Node.js 16.x or higher
- npm 8.x or higher
- Backend services running (or mock data enabled)

### Installation

```bash
# Clone repository
git clone https://gitlab.truebyteinnovation.com/sms/sms-academic-operations.git
cd sms-academic-operations

# Install dependencies
npm install
```

### Configuration

Create `.env` file in project root:

```env
# API Configuration
VITE_API_BASE_URL=http://127.0.0.1:8000

# Application
VITE_APP_NAME=School ERP
VITE_APP_VERSION=1.0.0

# Features
VITE_ENABLE_MOCK_DATA=false
```

**Reference file:** `.env.example`

### Running the Application

```bash
# Development server with hot reload
npm run dev

# Access at: http://localhost:5173
```

**Default Login Credentials (Development):**
```
Admin:
  Username: admin@school.com
  Password: admin123

Teacher:
  Username: teacher@school.com
  Password: teacher123

Student:
  Username: student@school.com
  Password: student123
```

---

## Build & Deployment

### Production Build

```bash
# Build optimized static files
npm run build

# Output: dist/ directory
```

### Preview Production Build

```bash
# Test production build locally
npm run preview
```

### Docker Deployment

```bash
# Build Docker image
docker build -t sms-frontend:latest .

# Run container
docker run -p 80:80 --env-file .env sms-frontend:latest
```

**Production compose file:** `docker-compose.prod.yml`

### Deployment Script

```bash
# Deploy to production
./ops/deploy.sh
```

Expected behavior:
- Pulls latest code from `Development` branch
- Builds production bundle
- Deploys to web server
- Clears CDN cache (if configured)

---

## Environment Variables

### Required
```env
VITE_API_BASE_URL          # Backend API gateway URL
```

### Optional
```env
VITE_APP_NAME              # Application title (default: School ERP)
VITE_APP_VERSION           # Version number
VITE_ENABLE_MOCK_DATA      # Use mock data (true/false)
VITE_SESSION_TIMEOUT       # Session timeout in minutes
```

---

## Testing & Mock Data

All services include a **mock data toggle** for development without backend:

```javascript
// In service files (e.g., attendanceService.js)
const USE_MOCK_DATA = true; // Toggle between mock and real API

if (USE_MOCK_DATA) {
  await delay(300); // Simulate network latency
  return { data: mockData };
}
return api.get('/real-endpoint');
```

**Mock Data Features:**
- Simulates API responses with realistic data
- Includes validation and error scenarios
- Network latency simulation for UX testing
- No backend dependencies required

**Switch to Production:**
1. Set `USE_MOCK_DATA = false` in service files
2. Configure `VITE_API_BASE_URL` in `.env`
3. Ensure backend services are running

---

## Behavioral Updates (2026)

### Bulk Operations
- All bulk upload forms now support **partial success** mode
- Invalid rows are reported with specific error messages
- Valid rows are processed and committed
- Response format standardized:
  ```json
  {
    "message": "Processed 45 of 50 records",
    "processed": 45,
    "skipped": 5,
    "errors": [
      {"row": 3, "error": "Invalid student ID"},
      {"row": 7, "error": "Duplicate entry"}
    ]
  }
  ```

### Progress Dashboard
- New student progress endpoint aggregates exam and assignment trends
- Real-time attendance percentage calculation
- Subject-wise performance breakdown
- Low attendance alerts for teachers

### UI Enhancements
- Responsive design for mobile/tablet
- Dark mode support (planned)
- Accessibility improvements (ARIA labels)
- Loading states for all async operations

---

## Branch Strategy

```
main              → Production-ready code (protected)
  ↓
Development       → Latest development code (deployment branch)
  ↓
QC                → Quality assurance testing
  ↓
feature/*         → Individual feature branches (e.g., feature/attendance-ravitheja)
```

### Workflow

1. Create feature branch from `Development`
   ```bash
   git checkout Development
   git pull origin Development
   git checkout -b feature/module-name-yourname
   ```

2. Develop and commit changes
   ```bash
   git add .
   git commit -m "feat: Add feature description"
   ```

3. Push feature branch
   ```bash
   git push -u origin feature/module-name-yourname
   ```

4. Create **Merge Request** to `Development`
   - Assign reviewer: Gokulnath
   - Add labels: `enhancement`, `frontend`
   - Provide detailed description

5. Address review comments if needed

6. After approval, merge to `Development`

7. QA team tests in `Development` branch

8. Approved features merged to `main` for production

---

## Code Standards

### Component Guidelines
- Use **functional components** with hooks (no class components)
- Keep components **small and focused** (< 300 lines)
- Extract reusable logic into **custom hooks**
- Use **PropTypes** or TypeScript for type safety (planned)

### Naming Conventions
```javascript
// Components: PascalCase
DashboardLayout.jsx
StudentAttendance.jsx

// Files: camelCase
academicService.js
useAuth.js

// Constants: UPPER_SNAKE_CASE
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Functions: camelCase
const fetchStudents = async () => {...}
```

### Commit Message Format
```
feat: Add new feature
fix: Fix bug in component
docs: Update README
style: Format code
refactor: Refactor service logic
test: Add unit tests
chore: Update dependencies
```

**Examples:**
```
feat(attendance): Add bulk attendance marking
fix(fees): Resolve payment calculation error
docs(readme): Add deployment instructions
```

---

## Operational Notes

### Performance
- Code splitting enabled (React.lazy)
- Image optimization in build process
- Gzip compression in production
- CDN integration for static assets

### Monitoring
- Error tracking via console logs (Sentry integration planned)
- User session analytics
- API response time monitoring
- Failed request retry logic (3 attempts)

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## Production Readiness Checklist

**Security:**
- [ ] Environment variables secured (no secrets in code)
- [ ] HTTPS enforced
- [ ] CSP headers configured
- [ ] XSS protection enabled
- [ ] CSRF tokens implemented

**Performance:**
- [ ] Code splitting enabled
- [ ] Images optimized and lazy-loaded
- [ ] Fonts preloaded
- [ ] Bundle size < 500KB (gzipped)

**Quality:**
- [ ] No console errors in production
- [ ] All forms validated
- [ ] Error boundaries implemented
- [ ] Loading states on all async operations

**Deployment:**
- [ ] CI/CD pipeline configured
- [ ] Automated tests passing
- [ ] Staging environment tested
- [ ] Rollback plan documented

---

## Troubleshooting

### Common Issues

**1. API Connection Failed**
```javascript
// Check VITE_API_BASE_URL in .env
// Ensure backend services are running
// Verify CORS settings on backend
```

**2. Authentication Loop**
```javascript
// Clear local storage: localStorage.clear()
// Check JWT token expiry
// Verify backend JWT secret matches
```

**3. Build Errors**
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
```

**4. Slow Performance**
```javascript
// Enable React DevTools Profiler
// Check for unnecessary re-renders
// Verify mock data is disabled in production
```

---

## Module Statistics

| Module       | Pages | Service File       | API Endpoints | Lines of Code |
|--------------|-------|--------------------|---------------|---------------|
| Academic     | 8     | academicService.js | 15+           | ~2,500        |
| Assessment   | 8     | assessmentService.js | 20+         | ~3,000        |
| Fees         | 2     | feeService.js      | 6+            | ~800          |
| Attendance   | 9     | attendanceService.js | 12+         | ~3,500        |
| **Total**    | **27**| **4 files**        | **53+**       | **~9,800**    |

---

## Team & Contact

**Development Team:**
- Developer: Ravitheja
- Code Reviewer: Gokulnath
- Organization: TrueByte Innovation

**Getting Help:**
- Create issue in GitLab: [Issues](https://gitlab.truebyteinnovation.com/sms/sms-academic-operations/-/issues)
- Contact team lead: gokulnath@truebyteinnovation.com
- Internal documentation: [Wiki](https://gitlab.truebyteinnovation.com/sms/sms-academic-operations/-/wikis/home)

---

## License

Proprietary - TrueByte Innovation  
All rights reserved. Unauthorized copying or distribution prohibited.

---

## Changelog

### Version 1.0.0 (Initial Release - March 2026)

**Added:**
- ✅ Academic Management module (8 pages)
- ✅ Assessment Management module (8 pages)
- ✅ Fee Management module (2 pages)
- ✅ Attendance & Timetable module (9 pages)
- ✅ Role-based access control (Admin/Teacher/Student)
- ✅ Responsive UI design (mobile-first)
- ✅ Mock data integration for development
- ✅ Complete CRUD operations
- ✅ Bulk operations with partial success handling
- ✅ Form validations and error handling
- ✅ API integration with all backend services

**Known Limitations:**
- Mock data enabled by default (backend integration in progress)
- Some assessment features pending backend completion
- Report card PDF generation UI complete (backend pending)
- Mobile app under development

---

## Quick Links

- **GitLab Repository:** [sms-academic-operations](https://gitlab.truebyteinnovation.com/sms/sms-academic-operations)
- **Backend Services:** [SMS Backend Repos](https://gitlab.truebyteinnovation.com/sms)
- **Design System:** [UI Components](https://ant.design/components/overview/)
- **API Documentation:** [Swagger Docs](http://127.0.0.1:8000/docs)

---

**Built with ❤️ by TrueByte Innovation Team**

*Last Updated: March 17, 2026*