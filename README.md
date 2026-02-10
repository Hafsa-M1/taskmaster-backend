# TaskMaster – Backend

**Personal Task & Time Tracker API**
NestJS + TypeScript + PostgreSQL backend for authentication, task CRUD, and time tracking.
Built as part of ANKA Technologies Full-Stack Development Assignment.

---

## Technologies Used

* NestJS 10 + TypeScript
* TypeORM + PostgreSQL
* JWT (Passport + passport-jwt)
* class-validator & class-transformer
* bcrypt (password hashing)

---

## Setup Instructions (Local Development)

1. **Clone the repository**

   ```bash
   git clone https://github.com/Hafsa-M1/taskmaster-backend.git
   cd taskmaster-backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create `.env` file** in the root
   Add the following:

   ```env
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_USERNAME=postgres
   DATABASE_PASSWORD=your_password
   DATABASE_NAME=taskmaster
   JWT_SECRET=super-secret-key-change-this-in-production
   PORT=3000
   ```

4. **Create PostgreSQL database** (if not exists)

   ```sql
   CREATE DATABASE taskmaster;
   ```

5. **Start development server**

   ```bash
   npm run start:dev
   ```

   API will be available at [http://localhost:3000](http://localhost:3000)

---

## Environment Variables

| Variable            | Description                                   |
| ------------------- | --------------------------------------------- |
| `DATABASE_HOST`     | PostgreSQL host                               |
| `DATABASE_PORT`     | PostgreSQL port (default: 5432)               |
| `DATABASE_USERNAME` | PostgreSQL username                           |
| `DATABASE_PASSWORD` | PostgreSQL password                           |
| `DATABASE_NAME`     | Database name (taskmaster)                    |
| `JWT_SECRET`        | Secret for JWT signing (change in production) |
| `PORT`              | Server port (default: 3000)                   |

---

## Database Setup

* PostgreSQL (local or Docker)
* Tables auto-created on startup (`synchronize: true` – development only)

---

## API Endpoints

### Authentication

| Endpoint         | Method | Body / Header                                              | Description                               |
| ---------------- | ------ | ---------------------------------------------------------- | ----------------------------------------- |
| `/auth/register` | POST   | `{ "email": string, "password": string, "name"?: string }` | Register a new user → 201 Created         |
| `/auth/login`    | POST   | `{ "email": string, "password": string }`                  | Login → returns `{ access_token: "..." }` |
| `/auth/me`       | GET    | Header: `Authorization: Bearer <token>`                    | Get current logged-in user (protected)    |

### Tasks (protected – Bearer token required)

| Endpoint     | Method | Body                                                       | Description                        |
| ------------ | ------ | ---------------------------------------------------------- | ---------------------------------- |
| `/tasks`     | POST   | `{ "title": string, "description"?: string }`              | Create a new task                  |
| `/tasks`     | GET    | —                                                          | List of user's tasks               |
| `/tasks/:id` | PATCH  | `{ "title"?, "description"?, "completed"?, "timeSpent"? }` | Update task by ID                  |
| `/tasks/:id` | DELETE | —                                                          | Delete task by ID → 204 No Content |

---

## Project Structure

```
src/
├── auth/
├── entities/
├── tasks/
├── users/
├── app.module.ts
└── main.ts
```

---

**Tip:** Keep `.env` secure and do not push sensitive credentials to the repository.

