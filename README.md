# Task Manager - Full Stack Application

A modern task manager application built with NestJS and Next.js.

## Features

- User Authentication (Register, Login)
- Task Management (Create, Read, Update, Delete)
- Task Status Tracking
- Responsive UI
- JWT Authentication

## Tech Stack

### Backend
- NestJS
- TypeORM
- PostgreSQL
- JWT Authentication
- Passport.js

### Frontend
- Next.js
- React
- Zustand (State Management)
- React Hook Form
- Tailwind CSS
- Axios

## Getting Started

### Prerequisites
- Node.js (v16 or later)
- NPM or Yarn
- PostgreSQL

### Database Setup
1. Create a PostgreSQL database named `task_manager`
2. Update the database connection string in the backend `.env` file if needed

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run start:dev
   ```

4. The API will be available at `http://localhost:3001/api`

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open your browser and visit `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login

### Users
- `GET /api/users` - Get all users (protected)
- `GET /api/users/:id` - Get user by ID (protected)
- `DELETE /api/users/:id` - Delete user (protected)

### Tasks
- `GET /api/tasks` - Get all tasks for the current user (protected)
- `GET /api/tasks/:id` - Get task by ID (protected)
- `POST /api/tasks` - Create a new task (protected)
- `PATCH /api/tasks/:id` - Update a task (protected)
- `DELETE /api/tasks/:id` - Delete a task (protected)

## License
This project is licensed under the MIT License.
