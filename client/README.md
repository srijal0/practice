# MERN Todo App

A full-stack todo list application built with MongoDB, Express, React, and Node.js. Includes user authentication, so each user has their own private, persistent todo list.

## Features

- User signup and login with JWT-based authentication
- Passwords hashed with bcrypt (never stored in plain text)
- Full CRUD: create, read, update, and delete todos
- Inline editing of todo text
- Mark todos as complete/incomplete
- Filter by All / Active / Completed
- Due dates on todos
- Categories/tags (Personal, Work, Urgent, Other) with color-coded badges
- "Tasks remaining" counter
- Per-user data isolation — users only ever see their own todos
- Redirect guards (logged-in users can't revisit login/signup; logged-out users can't access the todo list)
- Clean, custom-styled UI

## Tech Stack

**Frontend**
- React (via Vite)
- React Router for page navigation
- Vanilla CSS (no framework)

**Backend**
- Node.js + Express
- MongoDB with Mongoose
- JSON Web Tokens (JWT) for authentication
- bcryptjs for password hashing

## Project Structure

```
mern-todo/
├── client/                 # React frontend
│   └── src/
│       ├── pages/
│       │   ├── Login.jsx
│       │   ├── Signup.jsx
│       │   └── TodoList.jsx
│       ├── App.jsx         # Router setup
│       ├── App.css
│       └── Auth.css
└── server/                 # Express backend
    ├── models/
    │   ├── Todo.js
    │   └── User.js
    ├── routes/
    │   ├── todos.js
    │   └── auth.js
    ├── middleware/
    │   └── auth.js          # JWT verification middleware
    └── index.js
```

## Setup Instructions

### Prerequisites
- Node.js installed
- A MongoDB Atlas account (or local MongoDB instance)

### Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in `server/` with:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret_string
PORT=5000
```

Start the backend:

```bash
npm run dev
```

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

The app will be available at `http://localhost:5173`, with the API running at `http://localhost:5000`.

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Create a new account |
| POST | `/api/auth/login` | Log in and receive a JWT |

### Todos (all require `Authorization: Bearer <token>` header)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/todos` | Get all todos for the logged-in user |
| POST | `/api/todos` | Create a new todo |
| PUT | `/api/todos/:id` | Update a todo |
| DELETE | `/api/todos/:id` | Delete a todo |

## Environment Variables

| Variable | Description |
|----------|--------------|
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key used to sign JWTs |
| `PORT` | Port the backend server runs on (default: 5000) |

## License

This project was built as a learning exercise.