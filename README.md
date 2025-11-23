# Course Activity Management and Monitoring System (CAMMS)

A comprehensive web-based application designed to streamline and automate daily tasks performed by instructors in an LMS-based environment. The system tracks activities such as MDB replies, ticket responses, assignment uploads and marking, GDB marking, and email handling, while generating detailed performance reports.

## 🚀 Features

### Admin Features
- **User Management**: Create, Read, Update, Delete users
- **System Settings Configuration**:
  - Maintenance Mode: Control system access (only admins can login during maintenance)
  - Notification Alert Days: Configure how many days before activity deadline instructors receive alerts (1-30 days)
- **Report Generation**: Generate Weekly, Monthly, and Five-Month reports for all or specific instructors
- **System Dashboard**: View comprehensive analytics with interactive charts
- **Activity Monitoring**: View all instructor activities across the system

### Instructor Features
- **Activity Logging**: Log various activity types:
  - MDB Replies
  - Ticket Responses
  - Assignment Uploads
  - Assignment Marking
  - GDB Marking
  - Weekly Sessions
  - Email Responses
- **Personal Dashboard**: View statistics, charts, and performance metrics
  - Activity trends (daily, weekly, monthly, yearly)
  - Activity type distribution
  - Completion rates
  - Time spent analytics
- **Report Management**: View and export personal reports (PDF/Excel)
- **Notifications**: View and manage activity deadline alerts
- **Profile Management**: Update profile information and upload profile images

### System Features
- **Dark Mode**: Full dark theme support with persistent user preference
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Real-time Notifications**: Activity deadline reminders based on configurable alert days
- **Role-based Access Control**: Secure authentication and authorization
- **API Documentation**: Interactive Swagger UI for API exploration

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express.js** - RESTful API
- **PostgreSQL** - Relational Database
- **Prisma** - ORM (Object-Relational Mapping)
- **JWT** - Authentication & Authorization
- **Python** (pandas, matplotlib) - Report Generation Service
- **Swagger** - API Documentation
- **Jest** - Testing Framework

### Frontend
- **React.js** - Single Page Application
- **Vite** - Build Tool and Dev Server
- **TailwindCSS** - Utility-first CSS Framework
- **Recharts** - Data Visualization Library
- **SweetAlert2** - Beautiful Alert Dialogs
- **React Router DOM** - Client-side Routing
- **Vitest** - Unit Testing Framework

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **PostgreSQL** (v12 or higher)
- **Python 3.8+** with pip
- **npm** or **yarn**

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd camms
```

### 2. Database Setup

```bash
# Create PostgreSQL database
createdb camms_db
```

### 3. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file with your database credentials
# Option 1: Use DATABASE_URL
# DATABASE_URL=postgresql://user:password@localhost:5432/camms_db

# Option 2: Use individual variables
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=camms_db
# DB_USER=postgres
# DB_PASSWORD=your_password

# JWT Configuration
# JWT_SECRET=your-secret-key-here
# JWT_REFRESH_SECRET=your-refresh-secret-key-here

# Server Configuration
# PORT=5000
# NODE_ENV=development

# Generate Prisma Client
npm run prisma:generate

# Run database migrations (creates schema)
npm run prisma:migrate

# Install Python dependencies for reporting service
cd services
pip install -r requirements.txt
cd ..

# Seed database (optional, creates sample data and default users)
npm run seed

# Start backend server
npm run dev
```

Backend will run on `http://localhost:5000`

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on `http://localhost:3000`

## ⚡ Quick Start

For a quick setup, follow these steps:

```bash
# 1. Clone and navigate
git clone <repository-url>
cd camms

# 2. Create database
createdb camms_db

# 3. Backend setup
cd backend
npm install
# Create .env file with DATABASE_URL and JWT secrets
npm run prisma:generate
npm run prisma:migrate
npm run seed
npm run dev

# 4. Frontend setup (in new terminal)
cd frontend
npm install
npm run dev

# 5. Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
# API Docs: http://localhost:5000/api-docs
```

## 🔐 Default Credentials

After running the seed script, you can login with:

**Admin:**
- Email: `atif.mubashar@vu.edu.pk`
- Password: `Admin@2024#Secure`

**Instructors (15 instructors available):**
- Email: Any of the following (e.g., `ahmed.khan@vu.edu.pk`, `fatima.ali@vu.edu.pk`, etc.)
- Password: `Instructor@2024#Secure`

**Available Instructor Emails:**
- `ahmed.khan@vu.edu.pk`
- `fatima.ali@vu.edu.pk`
- `muhammad.hassan@vu.edu.pk`
- `ayesha.malik@vu.edu.pk`
- `usman.raza@vu.edu.pk`
- `sana.iqbal@vu.edu.pk`
- `bilal.ahmed@vu.edu.pk`
- `zainab.shah@vu.edu.pk`
- `hassan.butt@vu.edu.pk`
- `amina.khan@vu.edu.pk`
- `tariq.mehmood@vu.edu.pk`
- `rabia.nawaz@vu.edu.pk`
- `imran.sheikh@vu.edu.pk`
- `hina.rashid@vu.edu.pk`
- `kamran.yousuf@vu.edu.pk`

> **Note**: 
> - During maintenance mode, only admins can login. Instructors will be blocked from accessing the system.
> - The seed script creates **1200+ activities** distributed across all instructors with realistic Pakistani names and course codes from the BS(CS) study scheme.
> - All user IDs are auto-generated UUIDs (not sequential numbers).

## 📁 Project Structure

```
camms/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma          # Prisma schema definition
│   ├── services/
│   │   ├── reporting_service.py   # Python reporting service
│   │   └── requirements.txt       # Python dependencies
│   ├── src/
│   │   ├── __tests__/             # Unit and integration tests
│   │   │   ├── integration/       # API integration tests
│   │   │   ├── services/          # Service unit tests
│   │   │   └── utils/             # Utility tests
│   │   ├── config/                 # Configuration files
│   │   │   ├── __mocks__/         # Test mocks
│   │   │   ├── prisma.js          # Prisma client
│   │   │   ├── env.js             # Environment variables
│   │   │   └── swagger.js         # API documentation
│   │   ├── controllers/           # Request handlers
│   │   ├── middleware/             # Auth, validation, error handling
│   │   ├── models/                 # Database models (Prisma-based)
│   │   │   └── __mocks__/         # Model mocks for testing
│   │   ├── routes/                 # API routes with Swagger docs
│   │   ├── services/               # Business logic
│   │   ├── scripts/                # Database seeding and export scripts
│   │   │   ├── seed.js            # Database seeding script
│   │   │   └── exportMockData.js  # Export mock LMS dataset
│   │   └── utils/                  # Utilities (JWT, logger, date utils)
│   │       └── __mocks__/         # Utility mocks for testing
│   ├── jest.config.js              # Jest configuration
│   ├── jest.setup.js                # Jest setup file
│   └── package.json
├── backend/
│   └── exports/                    # Exported mock LMS datasets (CSV/JSON)
├── USER_MANUAL.md                   # Comprehensive user manual
├── frontend/
│   ├── public/                      # Static assets
│   │   └── assets/                 # Images and media
│   ├── src/
│   │   ├── __tests__/              # Unit tests
│   │   ├── api/                    # API client functions
│   │   ├── components/             # Reusable components
│   │   │   ├── Layout.jsx          # Main layout wrapper
│   │   │   ├── Sidebar.jsx         # Navigation sidebar
│   │   │   ├── Navbar.jsx          # Top navigation bar
│   │   │   ├── DarkModeToggle.jsx  # Dark mode switcher
│   │   │   └── ...                 # Other components
│   │   ├── context/                 # React context providers
│   │   │   └── AuthContext.jsx     # Authentication context
│   │   ├── hooks/                   # Custom React hooks
│   │   │   └── useDarkMode.js      # Dark mode hook
│   │   ├── pages/                   # Page components
│   │   │   ├── admin/              # Admin pages
│   │   │   ├── instructor/         # Instructor pages
│   │   │   ├── auth/               # Authentication pages
│   │   │   └── ProfilePage.jsx      # User profile page
│   │   ├── utils/                   # Utility functions
│   │   ├── App.jsx                  # Main app component
│   │   └── main.jsx                 # Application entry point
│   ├── tailwind.config.js           # Tailwind CSS configuration
│   ├── vite.config.js               # Vite configuration
│   └── package.json
└── uploads/                          # Generated report files
```

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # With coverage report
```

**Test Coverage:**
- Unit tests for services (Auth, Activity, Report, Notification, Dashboard)
- Integration tests for API endpoints
- Utility function tests
- Mock implementations for Prisma and external dependencies

### Frontend Tests

```bash
cd frontend
npm test              # Run all tests
npm run test:coverage # With coverage report
```

**Test Coverage:**
- Component tests
- Page tests
- Utility and API tests
- Context tests

## 📊 API Documentation

### Swagger UI
Once the backend server is running, access the interactive API documentation at:
- **URL**: `http://localhost:5000/api-docs`

The Swagger UI provides:
- Complete API endpoint documentation
- Request/response schemas
- Try-it-out functionality
- Authentication testing

## 📊 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Users (Admin only)
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Activities (Instructor)
- `GET /api/activities` - List activities (with filters)
- `GET /api/activities/:id` - Get activity by ID
- `POST /api/activities` - Log new activity
- `PUT /api/activities/:id` - Update activity
- `DELETE /api/activities/:id` - Delete activity

### Reports
- `POST /api/reports/generate` - Generate report
- `POST /api/reports/generate-file` - Generate and download report file
- `GET /api/reports` - List reports
- `GET /api/reports/:id` - Get report by ID

### Notifications
- `GET /api/notifications` - List notifications
- `GET /api/notifications/unread-count` - Get unread count
- `PATCH /api/notifications/:id/read` - Mark as read

### Dashboard
- `GET /api/dashboard/instructor?dateRange={daily|weekly|monthly|yearly}` - Instructor dashboard data
- `GET /api/dashboard/admin?dateRange={daily|weekly|monthly|yearly}` - Admin dashboard data

### Settings (Admin only)
- `GET /api/settings` - Get all settings
- `PUT /api/settings` - Update settings
  - `MAINTENANCE_MODE`: Enable/disable maintenance mode
  - `REMINDER_DAYS_BEFORE_DEADLINE`: Set notification alert days (1-30)

### Upload
- `POST /api/upload/profile-image` - Upload profile image

> **Note**: For detailed API documentation with request/response examples, visit the Swagger UI at `http://localhost:5000/api-docs`

## 🐍 Python Reporting Service

The system uses a Python service (running as a child process) for generating PDF and Excel reports using pandas and matplotlib. The service:

- Generates professional PDF reports with charts and cover pages
- Creates Excel reports with multiple sheets and styling
- Runs internally without requiring a separate terminal
- Supports both PDF and Excel export formats

**Installation:**
```bash
cd backend/services
pip install -r requirements.txt
```

## 🗄️ Database Management

### Prisma Commands

```bash
cd backend

# Generate Prisma Client (after schema changes)
npm run prisma:generate

# Create and apply migrations
npm run prisma:migrate

# Open Prisma Studio (database GUI)
npm run prisma:studio

# Reset database (development only)
npx prisma migrate reset

# Seed database with sample data
npm run seed

# Export mock LMS dataset (CSV/JSON)
npm run export:mock
```

**Seed Script Details:**
- **Clears all existing data** before seeding (activities, users, notifications, reports)
- Creates **1 admin user** with Pakistani name: `atif.mubashar@vu.edu.pk`
- Creates **15 instructor users** with Pakistani names and realistic email addresses
- Generates **1200+ activities** distributed across all instructors
- Uses **real course codes** from BS(CS) study scheme (CS101, ENG101, MTH101, etc.)
- Activities span **6 months** of historical data
- All user IDs are **auto-generated UUIDs** (not sequential)
- Realistic activity descriptions and metadata
- Strong passwords following best practices: `Admin@2024#Secure` (admin) and `Instructor@2024#Secure` (instructors)
- Activity Status Distribution: 60% COMPLETED, 40% PENDING

### Schema Management
- Database schema is defined in `backend/prisma/schema.prisma`
- All schema changes should be made through Prisma migrations
- Never edit the database directly - use Prisma migrations

## ⚙️ System Settings

### Maintenance Mode
- When enabled, only administrators can login
- Instructors and other users are blocked from accessing the system
- Useful for system updates or maintenance periods

### Notification Alert Days
- Configure how many days before an activity deadline instructors receive alerts
- Range: 1-30 days
- Default: 2 days
- Accessible via Admin Settings page

## 🎨 Dark Mode

The application includes a comprehensive dark mode implementation:

- **Toggle Button**: Located in the navbar (top-right)
- **Persistent Preference**: Saves user's theme choice in localStorage
- **System Preference**: Automatically detects system theme on first visit
- **Full Coverage**: All components and pages support dark mode
- **Smooth Transitions**: Animated theme switching

## 🚢 Deployment

**📖 For detailed free deployment instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)**

### Quick Deployment Summary

#### Recommended Free Stack (2025):
- **Frontend**: Vercel (Free) or Netlify (Free)
- **Backend**: Render (Free) or Railway (Free)
- **Database**: Supabase PostgreSQL (Free) or Neon (Free)

#### Quick Steps:
1. **Database**: Create Supabase project → Get connection string
2. **Backend**: Deploy on Render → Add environment variables → Deploy
3. **Frontend**: Deploy on Vercel → Add `VITE_API_URL` → Deploy
4. **Update CORS**: Add frontend URL to backend `FRONTEND_URL` environment variable

### Environment Variables for Production

#### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=your-secret-key-here
JWT_REFRESH_SECRET=your-refresh-secret-key-here
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-frontend.vercel.app
```

#### Frontend (.env.production)
```env
VITE_API_URL=https://your-backend.onrender.com/api
```

### Deployment Files
- `backend/render.yaml` - Render deployment configuration
- `frontend/vercel.json` - Vercel deployment configuration

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for complete step-by-step instructions.

## 📝 Environment Variables

### Backend (.env)

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/camms_db
# Or individual variables:
DB_HOST=localhost
DB_PORT=5432
DB_NAME=camms_db
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your-secret-key-here
JWT_REFRESH_SECRET=your-refresh-secret-key-here

# Server
PORT=5000
NODE_ENV=development

# API
API_URL=http://localhost:5000/api
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

## 📊 Mock LMS Dataset Export

Export all database data to CSV and JSON formats for use as a mock LMS dataset:

```bash
cd backend
npm run export:mock
```

This creates files in `backend/exports/`:
- **CSV files**: `users.csv`, `activities.csv`, `activity_types.csv`, `roles.csv`, `system_settings.csv`, `notifications.csv`
- **JSON files**: Individual JSON files for each table
- **Combined**: `mock_lms_dataset.json` - Complete dataset in a single file

The exported data can be used for:
- Importing into other systems
- Data analysis and reporting
- Testing integrations
- Creating backups
- Academic demonstrations

## 📖 User Manual

A comprehensive user manual is available at `USER_MANUAL.md` covering:
- Getting started guide
- Admin features and workflows
- Instructor features and workflows
- System settings configuration
- Troubleshooting guide
- FAQs

## 🔍 Development Tools

- **Prisma Studio**: Visual database browser - `npm run prisma:studio`
- **Swagger UI**: Interactive API documentation - `http://localhost:5000/api-docs`
- **Test Coverage**: Run `npm run test:coverage` in both backend and frontend
- **Dark Mode**: Toggle available in navbar for testing UI in both themes
- **Mock Data Export**: Export database to CSV/JSON - `npm run export:mock`

## 📞 Support

For issues or questions, please contact the development team.

## 📄 License

This project is developed for academic purposes.

## 👥 Authors

- **BC220202537**
- **Supervisor**: Saima Jamil

## 🔍 Additional Information

### Health Check
- `GET /health` - Check if the API is running

### Features Summary
- ✅ User authentication and authorization
- ✅ Role-based access control (Admin/Instructor)
- ✅ Activity tracking and logging
- ✅ Report generation (PDF/Excel)
- ✅ Dashboard with analytics and charts
- ✅ Notification system with configurable alerts
- ✅ Dark mode support
- ✅ Responsive design
- ✅ Profile management
- ✅ System settings management
- ✅ Maintenance mode
- ✅ Comprehensive test coverage

---

**Note**: This system simulates LMS behavior with dummy data. It does not connect to a real LMS system.
