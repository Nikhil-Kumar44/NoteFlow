# NoteFlow

NoteFlow is a modern, full-stack smart note-taking web application with a premium user interface. It features complete user authentication, role-based access control, note management (Create, Read, Update, Delete), real-time search functionality, and a beautiful dark mode toggle.

## Tech Stack

- **Frontend:** React.js, Vite, Vanilla CSS (Premium UI, Custom Variables, Dark Mode)
- **Backend:** Node.js, Express.js (v5), MongoDB (via Mongoose)
- **Authentication:** JWT (JSON Web Tokens), bcrypt for password hashing
- **Security:** Helmet (secure headers), express-mongo-sanitize (NoSQL Injection protection), CORS
- **Validation:** express-validator
- **Documentation:** Swagger UI (OpenAPI 3.0)
- **Other:** Axios, React Router, Lucide React (icons)

## Features

- **User Authentication:** Secure signup and login with JWT and bcrypt password hashing.
- **Role-Based Access Control (RBAC):** 
  - **User Role (Default):** Manage (Create, Read, Update, Delete) own notes.
  - **Admin Role:** View all users, view all notes across the entire application, and delete any note.
- **API Versioning:** Clean, production-ready versioned API routes (`/api/v1/...`).
- **Input Validation:** Server-side request checks to prevent invalid, empty, or unsafe data payload inputs.
- **Swagger Documentation:** Auto-documented endpoints served natively at `/api-docs`.
- **Toast Notifications:** Smooth, animated Success/Error alerts.
- **Dark Mode:** Seamless toggle between light and dark themes.
- **Protected Routes:** Dashboard is restricted to authenticated users.

## Project Structure

```
NoteFlow/
│
├── backend/                  # Express server
│   ├── controllers/          # Route controller logic
│   ├── middleware/           # Custom middleware (Auth, validation, error)
│   ├── models/               # Mongoose schemas (User, Note)
│   ├── routes/               # Express routes
│   ├── swagger.json          # Swagger/OpenAPI documentation specification
│   ├── .env                  # Environment variables for backend
│   └── server.js             # Entry point
│
└── frontend/                 # React application (Vite)
    ├── src/
    │   ├── components/       # Reusable UI components (Navbar, NoteCard, NoteModal)
    │   ├── context/          # React Context (Auth)
    │   ├── pages/            # Page components (Dashboard, Login, Signup)
    │   ├── App.jsx           # Main App layout and routing
    │   └── index.css         # Global styles, toasts, and theme variables
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
DB_NAME=NoteFlow
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

---

## API Documentation

When the backend server is running, the interactive **Swagger UI** documentation is available at:
`http://localhost:5000/api-docs`

### Auth Endpoints

* **POST** `/api/v1/auth/signup` - Register a new user. You can optionally pass `"role": "admin"` in the request body to create an admin account.
* **POST** `/api/v1/auth/login` - Authenticate user credentials and return a token.
* **GET** `/api/v1/auth/me` - Get current user profile (requires Bearer token).
* **GET** `/api/v1/auth/users` - Retrieve all registered users (requires Bearer token, Admin role only).

### Notes Endpoints

* **GET** `/api/v1/notes` - Get notes (requires Bearer token). Standard users retrieve their own notes; Admin users retrieve all database notes. Supports `?search=term`.
* **POST** `/api/v1/notes` - Create a note (requires Bearer token).
* **PUT** `/api/v1/notes/:id` - Update a note (requires Bearer token, Owner only).
* **DELETE** `/api/v1/notes/:id` - Delete a note (requires Bearer token, Owner or Admin).

---

## Testing the API & RBAC

To make evaluation simple, an automated integration test suite is included in the backend to assert input validation, authorization rules, admin permissions, and API documentation route availability.

1. Make sure the backend server is running (`npm run dev`).
2. Run the test suite from the `backend` directory:
   ```bash
   npm run test:api
   ```
   *Note: This script automatically simulates invalid requests, regular user registration, admin user registration, note creation, admin global note fetching, regular user access denials, admin user management lists, and administrative deletions.*
