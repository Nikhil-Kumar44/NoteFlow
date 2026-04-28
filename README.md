# NoteFlow

NoteFlow is a modern, full-stack smart note-taking web application with a premium user interface. It features complete user authentication, note management (Create, Read, Update, Delete), real-time search functionality, and a beautiful dark mode toggle.

## Tech Stack

- **Frontend:** React.js, Vite, Vanilla CSS (Premium UI, Custom Variables, Dark Mode)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (via Mongoose)
- **Authentication:** JWT (JSON Web Tokens), bcrypt for password hashing
- **Other:** Axios, React Router, Lucide React (icons)

## Features

- **User Authentication:** Secure signup and login with JWT and bcrypt password hashing.
- **Notes Management:** Create, edit, delete, and view your personal notes.
- **Search:** Real-time note search capability by title and content.
- **Dark Mode:** Seamless toggle between light and dark themes.
- **Responsive Design:** Premium, modern UI that works well across devices.
- **Protected Routes:** Dashboard is only accessible to authenticated users.

## Project Structure

```
NoteFlow/
│
├── backend/                  # Express server
│   ├── controllers/          # Route logic
│   ├── middleware/           # Custom middleware (Auth, Error handling)
│   ├── models/               # Mongoose schemas (User, Note)
│   ├── routes/               # Express routes
│   ├── .env                  # Environment variables for backend
│   └── server.js             # Entry point
│
└── frontend/                 # React application (Vite)
    ├── src/
    │   ├── components/       # Reusable UI components
    │   ├── context/          # React Context (Auth)
    │   ├── pages/            # Page components (Dashboard, Login, Signup)
    │   ├── App.jsx           # Main App layout and routing
    │   └── index.css         # Global styles and theme variables
    └── .env                  # Environment variables for frontend
```

## Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB URI (e.g., from MongoDB Atlas)

### 1. Clone the repository
```bash
git clone <repository-url>
cd NoteFlow
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with the following:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:5173
```

Start the backend development server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory with the following:
```env
VITE_API_URL=http://localhost:5000
```

Start the frontend development server:
```bash
npm run dev
```

The application will be running at `http://localhost:5173`.

## Deployment Steps

This application is ready to be deployed. Here is a standard approach:

### Backend (Render, Heroku, etc.)
1. Create a new Web Service on your platform of choice.
2. Set the build command to `npm install` and start command to `node server.js`.
3. Add your environment variables (`MONGODB_URI`, `JWT_SECRET`, `FRONTEND_URL`). Note: set `FRONTEND_URL` to your deployed frontend domain.
4. Deploy.

### Frontend (Vercel, Netlify, etc.)
1. Create a new project and link your repository.
2. Set the build directory to `frontend` (or run it from the root and configure `cd frontend`).
3. Set the build command to `npm run build` and publish directory to `dist`.
4. Add the `VITE_API_URL` environment variable pointing to your deployed backend URL.
5. Deploy.
