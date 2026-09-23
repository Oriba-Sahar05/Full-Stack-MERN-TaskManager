# Task Manager — MERN Capstone Project

A full-stack task management web app that lets users register, log in, and
manage their own personal task list with categories, priorities, due dates,
and status tracking. Built as the final capstone for the internship,
demonstrating a complete MERN stack: React frontend, Express/Node backend,
MongoDB database, REST API, and JWT authentication.

## Project Proposal

**Project title:** Task Manager

**Problem / idea:** People juggling multiple responsibilities need a simple,
private place to track tasks — what needs doing, how urgent it is, and
whether it's overdue — without the bloat of enterprise project-management
tools. This app gives each user their own secure task list accessible from
any browser.

**Main features:**
- User registration and login (JWT-based, hashed passwords)
- Create, view, edit, and delete tasks
- Categorize tasks, set priority (low/medium/high) and status
  (to do / in progress / done)
- Set due dates; dashboard highlights tasks due today or overdue
- Filter tasks by status/category and sort by due date or priority
- Fully responsive UI

**Technologies used:** React (Vite), React Router, Context API, Axios,
Node.js, Express, MongoDB Atlas, Mongoose, JWT, bcrypt.

## Live Deployment

- Frontend: `https://full-stack-mern-task-manager.vercel.app/`
- Backend API: `https://full-stack-mern-taskmanager-1.onrender.com`

## Tech Stack

| Layer      | Technology                                   |
|------------|-----------------------------------------------|
| Frontend   | React 18, Vite, React Router, Axios, Context API |
| Backend    | Node.js, Express.js                          |
| Database   | MongoDB Atlas, Mongoose ODM                  |
| Auth       | JWT (jsonwebtoken), bcryptjs                 |
| Validation | express-validator                            |
| Deployment | Vercel (frontend), Render (backend)          |

## Features

- **Auth:** register, login, logout, protected routes on both API and
  frontend, JWT stored client-side and attached to every API request.
- **Tasks:** full CRUD, scoped per-user (a user can only see/edit/delete
  their own tasks).
- **Dashboard:** live counts of total, in-progress, completed, due-today,
  and overdue tasks.
- **Validation & error handling:** server-side validation on register/login/
  task creation, centralized Express error handler, client-side loading and
  error states on every async action.

## Project Structure

```
task-manager/
├── server/               # Express API
│   ├── config/db.js
│   ├── models/           # User.js, Task.js
│   ├── controllers/      # authController.js, taskController.js
│   ├── middleware/       # auth.js, errorHandler.js
│   ├── routes/           # auth.js, tasks.js
│   ├── server.js
│   └── .env.example
└── client/               # React frontend
    ├── src/
    │   ├── api/axios.js
    │   ├── context/AuthContext.jsx
    │   ├── components/   # Navbar, TaskForm, TaskCard, ProtectedRoute, Loader
    │   ├── pages/         # Login, Register, Dashboard, Tasks
    │   ├── App.jsx
    │   └── main.jsx
    └── .env.example
```

## Local Setup

### Prerequisites
- Node.js 18+
- A MongoDB Atlas cluster (free tier is fine) — or a local MongoDB instance

### 1. Clone and install

```bash
git clone <your-repo-url>
cd task-manager

cd server && npm install
cd ../client && npm install
```

### 2. Configure environment variables

**server/.env** (copy from `server/.env.example`):
```
PORT=5000
MONGO_URI=<your MongoDB Atlas connection string>
JWT_SECRET=<a long random string>
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

**client/.env** (copy from `client/.env.example`):
```
VITE_API_URL=http://localhost:5000/api
```

> Never commit real `.env` files. Only `.env.example` files (with placeholder
> values) are tracked in this repo.

### 3. Run locally

```bash
# Terminal 1 - backend
cd server
npm run dev

# Terminal 2 - frontend
cd client
npm run dev
```

Frontend runs at `http://localhost:5173`, backend API at
`http://localhost:5000/api`.

## API Reference

Base URL: `/api`

### Auth

| Method | Route              | Access  | Body                              |
|--------|--------------------|---------|------------------------------------|
| POST   | `/auth/register`   | Public  | `{ name, email, password }`       |
| POST   | `/auth/login`      | Public  | `{ email, password }`             |
| GET    | `/auth/me`         | Private | —                                  |

### Tasks
All task routes require `Authorization: Bearer <token>`.

| Method | Route         | Access  | Notes                                             |
|--------|---------------|---------|----------------------------------------------------|
| GET    | `/tasks`      | Private | Query params: `status`, `category`, `sort`        |
| POST   | `/tasks`      | Private | Body: `{ title, description, category, priority, status, dueDate }` |
| PUT    | `/tasks/:id`  | Private | Body: any subset of task fields                   |
| DELETE | `/tasks/:id`  | Private | —                                                   |

All responses are JSON. Errors return `{ message: "..." }` with an
appropriate HTTP status code (400, 401, 403, 404, 500).

## Deployment Guide

### 1. MongoDB Atlas
1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Create a database user with a strong password.
3. Under Network Access, allow access from anywhere (`0.0.0.0/0`) or your
   host provider's IP range.
4. Copy the connection string into `MONGO_URI`.

### 2. Backend → Render
1. Create a new Web Service, connect this repo, set root directory to
   `server`.
2. Build command: `npm install`. Start command: `node server.js`.
3. Add environment variables: `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`,
   `CLIENT_URL` (set this to your deployed Vercel URL once you have it).
4. Deploy and confirm `GET /api/health` returns `{ "status": "ok" }`.

### 3. Frontend → Vercel
1. Import this repo, set root directory to `client`.
2. Framework preset: Vite.
3. Add environment variable `VITE_API_URL` set to your Render backend URL
   plus `/api` (e.g. `https://task-manager-api.onrender.com/api`).
4. Deploy.

### 4. Connect the two
Go back to Render and update `CLIENT_URL` to your live Vercel URL so CORS
allows requests from the deployed frontend. Redeploy the backend.

## Security Notes

- Passwords are hashed with bcrypt before being stored; plaintext passwords
  are never saved or logged.
- JWTs are signed server-side with a secret stored only in environment
  variables.
- `.env` files are excluded via `.gitignore` and were never committed.
- Task routes verify ownership (`task.user === req.user._id`) before allowing
  update/delete, so users cannot access or modify each other's data.
