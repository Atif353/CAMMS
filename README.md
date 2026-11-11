# CAMMS

**Course Activity Management and Monitoring System**

**Stack:** React · Node.js · Express · PostgreSQL · Prisma · JWT · Python

[Portfolio presentation](https://atifmubashar.vercel.app/work) · [Author](https://atifmubashar.vercel.app/) · [Contact](mailto:atifmubashar353@gmail.com)

An academic final-year project that simulates instructor activity workflows in an LMS-style environment. It supports activity logging, administrator oversight, dashboards, notifications, and PDF/Excel reporting.

**[Open the development demo →](https://camms-dev.vercel.app/)**

The demo login page was reachable during the audit. Its backend and authenticated workflows have not been verified in this review. This is a simulation with sample data, not an integration with a live university LMS.

## What it demonstrates

- **Backend:** Express REST APIs, service layers, request validation, JWT authentication, and role-based authorization.
- **Data:** PostgreSQL relational models and Prisma, with indexed activity and reporting fields.
- **Frontend:** React dashboards, Recharts visualizations, responsive layouts, and light/dark themes.
- **Reporting:** Python-based report generation, with PDF and Excel exports.
- **Testing:** Jest/Supertest backend tests and Vitest frontend tests are included.

## Main workflows

| Role | Workflows |
| --- | --- |
| Admin | User management, system settings, activity oversight, aggregate reports, analytics |
| Instructor | Activity logs, personal dashboard, report exports, notifications, profile management |

The current seed script defines **Admin** and **Instructor** roles. Activities include MDB replies, tickets, assignment uploads and marking, GDB marking, sessions, and email handling.

## Architecture

```text
React / Vite dashboard
        │ REST API + JWT
        ▼
Node.js / Express
        ├── Prisma → PostgreSQL
        └── Python reporting service → PDF / Excel
```

## Run locally

Requirements: Node.js 20+, PostgreSQL 12+, Python 3.8+, and npm.

```bash
git clone https://github.com/Atif353/CAMMS.git
cd CAMMS
```

Create a local PostgreSQL database, then configure `backend/.env`:

```dotenv
DATABASE_URL=postgresql://user:password@localhost:5432/camms_db
JWT_SECRET=replace-with-a-random-secret-of-at-least-32-characters
JWT_REFRESH_SECRET=replace-with-a-different-random-secret-of-at-least-32-characters
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

Use your own local credentials and fresh secrets. Do not commit environment files.

```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate
python -m pip install -r services/requirements.txt
npm run dev
```

In a separate terminal:

```bash
cd frontend
npm install
# Create .env with VITE_API_URL=http://localhost:5000/api
npm run dev
```

The existing project documentation uses frontend port 3000 and backend port 5000. Use the URLs printed by your dev servers if configured differently.

- API documentation: [local Swagger UI](http://localhost:5000/api-docs)
- Health endpoint: `GET /health`
- Frontend: [local dashboard](http://localhost:3000)

### Optional sample data

`npm run seed` in `backend/` clears existing application data and creates sample users and activities. Run it only against a disposable local development database. Review [the seed script](backend/src/scripts/seed.js) for its sample-account configuration. Do not use seed credentials on a public deployment.

## Repository guide

| Path | Purpose |
| --- | --- |
| [backend/src/routes](backend/src/routes) | API routes and Swagger documentation |
| [backend/src/services](backend/src/services) | Business logic |
| [backend/src/middleware](backend/src/middleware) | Auth, roles, validation, and errors |
| [backend/prisma/schema.prisma](backend/prisma/schema.prisma) | Relational schema |
| [backend/services](backend/services) | Python reporting service |
| [frontend/src](frontend/src) | React pages, API client, components, and context |

## Tests

```bash
cd backend
npm test
npm run test:coverage

# From the repository root, in a separate shell:
cd frontend
npm test
npm run test:coverage
```

Test files and commands are provided; no coverage percentage or current passing status is claimed here.

## Project context

Built by **Atif Mubashar** as a BS Computer Science final-year project at Virtual University of Pakistan. The original project credits identify supervisor **Saima Jamil**.

This README does not add or change license terms. No repository-level license file was found during this audit.
