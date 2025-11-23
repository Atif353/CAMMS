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

- **Node.js** (v20 or higher)
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
# JWT_SECRET=your-secret-key-here (min 32 characters)
# JWT_REFRESH_SECRET=your-refresh-secret-key-here (min 32 characters)

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

# Create .env file (optional for local development)
# VITE_API_URL=http://localhost:5000/api

# Start development server
npm run dev
```

Frontend will run on `http://localhost:3000`

## ⚡ Quick Start

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
│   │   ├── config/                 # Configuration files
│   │   ├── controllers/            # Request handlers
│   │   ├── middleware/             # Auth, validation, error handling
│   │   ├── models/                 # Database models (Prisma-based)
│   │   ├── routes/                 # API routes with Swagger docs
│   │   ├── services/               # Business logic
│   │   ├── scripts/                # Database seeding scripts
│   │   └── utils/                  # Utilities (JWT, logger, date utils)
│   └── package.json
├── frontend/
│   ├── public/                     # Static assets
│   ├── src/
│   │   ├── __tests__/              # Unit tests
│   │   ├── api/                    # API client functions
│   │   ├── components/             # Reusable components
│   │   ├── context/                 # React context providers
│   │   ├── hooks/                   # Custom React hooks
│   │   ├── pages/                   # Page components
│   │   └── utils/                   # Utility functions
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

### Frontend Tests

```bash
cd frontend
npm test              # Run all tests
npm run test:coverage # With coverage report
```

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
- Strong passwords following best practices
- Activity Status Distribution: 60% COMPLETED, 40% PENDING

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

## 📝 Environment Variables

### Backend (.env)

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/camms_db
# Or individual variables:
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=camms_db
# DB_USER=postgres
# DB_PASSWORD=your_password

# JWT (required, min 32 characters each)
JWT_SECRET=your-secret-key-here
JWT_REFRESH_SECRET=your-refresh-secret-key-here

# Server
PORT=5000
NODE_ENV=development

# API (optional)
API_URL=http://localhost:5000/api
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

## 🔍 Development Tools

- **Prisma Studio**: Visual database browser - `npm run prisma:studio`
- **Swagger UI**: Interactive API documentation - `http://localhost:5000/api-docs`
- **Test Coverage**: Run `npm run test:coverage` in both backend and frontend
- **Dark Mode**: Toggle available in navbar for testing UI in both themes

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
