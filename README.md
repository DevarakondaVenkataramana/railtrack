# RAILTRACK – Smart Train Journey Tracker

[![React](https://img.shields.io/badge/Frontend-React%20%7C%20Vite%20%7C%20TailwindCSS-blue.svg)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-green.svg)](https://nodejs.org/)
[![Database](https://img.shields.io/badge/Database-MongoDB%20Atlas%20%7C%20Mongoose-emerald.svg)](https://www.mongodb.com/atlas)
[![Authentication](https://img.shields.io/badge/Auth-JWT%20%7C%20bcryptjs-orange.svg)](https://jwt.io/)

A full-stack MERN railway journey tracking web application engineered for **B.Tech CSE Major Project** submissions and technical interview demonstrations. 

**RAILTRACK** solves the fragmentation of railway tracking systems by presenting an interactive, station-by-station vertical route timeline, scheduled vs. actual arrival/departure timings, automated delay calculations, destination arrival reminders, and an administrative control panel for fleet monitoring.

> **Academic & Simulation Notice:** Train schedules, stations, and live positions used in this application are realistic demo/simulation records stored in MongoDB. The architecture is modular and ready for plug-and-play integration with official railway APIs (e.g. IRCTC/RailYatri) in the future.

---

## Key Features

### Passenger Features
1. **Interactive Station Timeline**: Visual vertical route timeline displaying every intermediate halt, platform number, scheduled time, and actual timing.
2. **Dynamic Delay Tracking**: Automatically displays *On Time*, *Delayed (+Xm)*, *Arrived*, or *Departed* badges based on station calculations.
3. **Train Search Engine**: Search trains by source, destination, intermediate stop sequencing, and journey date.
4. **Live Journey Progress**: Real-time progress bar showing stations covered, percentage completion, current station, and estimated destination arrival.
5. **Start & Stop Journey**: Authenticated users can activate a journey, record travel history, and complete trips.
6. **Destination Arrival Reminder**: Configurable in-app alerts (10, 15, or 30 minutes before arrival) to alert passengers before approaching their destination.
7. **User Authentication & Profiles**: Secure JWT authentication with hashed passwords (bcryptjs), journey stats, and profile management.

### Administrator Features
8. **Admin Control Dashboard**: Real-time fleet metrics (Total Trains, Total Stations, Active Journeys, Delayed Trains).
9. **Fleet Management**: Add new trains with dynamic station route builders, edit existing schedules, and delete trains.
10. **Live Status Dispatcher**: Update current station, next stop, delay in minutes, and operational status in real-time.

---

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, React Router DOM v7, Tailwind CSS v4, Lucide React icons, Axios |
| **Backend** | Node.js, Express.js 5, Mongoose 9 |
| **Database** | MongoDB Atlas (Cloud) / Local MongoDB Server |
| **Security** | JSON Web Tokens (JWT), bcryptjs password hashing, Protected Route guards |
| **Deployment Targets** | **Frontend**: Vercel (SPA rewrites) • **Backend**: Render • **Database**: MongoDB Atlas |

---

## Project Folder Structure

```
Railtrack/
├── client/                     # React + Vite Frontend
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── AdminRoute.jsx      # Admin guard
│   │   │   ├── DelayBadge.jsx      # Delay status indicator
│   │   │   ├── Footer.jsx          # Professional footer
│   │   │   ├── LoadingSpinner.jsx  # Reusable loader
│   │   │   ├── Navbar.jsx          # Top navigation with mobile menu
│   │   │   ├── ProgressBar.jsx     # Journey percentage & status
│   │   │   ├── ProtectedRoute.jsx  # Auth route guard
│   │   │   ├── SearchForm.jsx      # Autocomplete search form
│   │   │   ├── StationCard.jsx     # Single station detail card
│   │   │   ├── StationTimeline.jsx # Main Innovative vertical timeline
│   │   │   └── TrainCard.jsx       # Train overview card
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Global authentication state
│   │   ├── pages/                  # Page views
│   │   │   ├── AddTrain.jsx        # Admin dynamic station builder
│   │   │   ├── AdminDashboard.jsx  # Admin metrics & quick status updater
│   │   │   ├── Dashboard.jsx       # Passenger dashboard
│   │   │   ├── EditTrain.jsx       # Admin edit train
│   │   │   ├── Home.jsx            # Landing page with hero & search
│   │   │   ├── JourneyDetails.jsx  # Active journey live tracker & alerts
│   │   │   ├── Login.jsx           # Login with 1-click demo accounts
│   │   │   ├── ManageTrains.jsx    # Admin fleet management table
│   │   │   ├── MyJourneys.jsx      # User travel history & active trips
│   │   │   ├── Profile.jsx         # User profile & stats
│   │   │   ├── Register.jsx        # Account registration
│   │   │   ├── SearchResults.jsx   # Filtered trains list
│   │   │   └── TrainDetails.jsx    # Complete station route & schedule
│   │   ├── services/               # API clients
│   │   │   ├── adminService.js
│   │   │   ├── api.js              # Axios interceptors for JWT
│   │   │   ├── authService.js
│   │   │   ├── journeyService.js
│   │   │   └── trainService.js
│   │   ├── App.jsx                 # Route definitions
│   │   ├── index.css               # Tailwind CSS imports
│   │   └── main.jsx
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── vercel.json                 # Vercel SPA route rewrite
│   └── vite.config.js              # Vite server & API proxy
│
├── server/                     # Node.js + Express Backend
│   ├── config/
│   │   └── db.js                   # Mongoose connection handler
│   ├── controllers/
│   │   ├── adminController.js      # Stats & aggregate metrics
│   │   ├── authController.js       # Register, login, profile
│   │   ├── journeyController.js    # Start, track, complete journey
│   │   └── trainController.js      # Train search, CRUD, status
│   ├── middleware/
│   │   ├── adminMiddleware.js      # Admin role validation
│   │   └── authMiddleware.js       # JWT Bearer token verification
│   ├── models/
│   │   ├── Journey.js              # Journey Mongoose schema
│   │   ├── Train.js                # Train & stations sub-document schema
│   │   └── User.js                 # User schema with bcrypt pre-save
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── journeyRoutes.js
│   │   └── trainRoutes.js
│   ├── seed/
│   │   └── seedData.js             # Realistic 5-train dataset with 6-8 stops
│   ├── .env.example
│   ├── package.json
│   └── server.js                   # Express server entry point
│
├── .gitignore
├── package.json                    # Workspace scripts
└── README.md
```

---

## Demo Credentials

For quick evaluation and testing during presentations, one-click demo login buttons are integrated into the `/login` page:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Standard User** | `user@railtrack.com` | `user123` | Search, start journey, view history, set destination reminders |
| **Admin Officer** | `admin@railtrack.com` | `admin123` | Full dashboard, add/edit trains, live status dispatcher |

---

## Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (Local community server or free MongoDB Atlas cluster)
- Git

### 1. Clone the repository
```bash
git clone https://github.com/your-username/railtrack.git
cd railtrack
```

### 2. Configure Environment Variables

#### Backend (`server/.env`):
Create a file named `.env` inside the `server/` directory:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/railtrack
JWT_SECRET=railtrack_super_secret_jwt_key_2026_dev
NODE_ENV=development
```
*(If using MongoDB Atlas, replace `MONGO_URI` with your Atlas connection string).*

#### Frontend (`client/.env`):
Create a file named `.env` inside the `client/` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

---

### 3. Install Dependencies & Seed Database

Open two terminal windows or run in order:

#### In the Backend:
```bash
cd server
npm install
npm run seed
```
> The seed script will insert demo accounts (User and Admin) and 5 detailed trains with full 6–8 station timelines (Circar Express, Vande Bharat, Rajdhani Superfast, Kerala Express, Shatabdi Express).

#### In the Frontend:
```bash
cd ../client
npm install
```

---

### 4. Running Locally

#### Run Backend Server:
```bash
cd server
npm run dev
# Server will start on http://localhost:5000
```

#### Run Frontend Client:
```bash
cd client
npm run dev
# Application will run on http://localhost:5173
```

---

## MongoDB Atlas Setup Guide

To deploy with MongoDB Atlas:
1. Create a free account at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Create a free shared cluster (M0 sandbox).
3. Under **Database Access**, create a database user with password (e.g. `railtrack_admin`).
4. Under **Network Access**, add IP address `0.0.0.0/0` (allow access from anywhere) so Render can connect.
5. Click **Connect** -> **Drivers (Node.js)** and copy your connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.mongodb.net/railtrack?retryWrites=true&w=majority
   ```
6. Update `MONGO_URI` in `server/.env`.
7. Run `npm run seed` in `server/` to populate your cloud Atlas database!

---

## API Endpoints Reference

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register new user (`name`, `email`, `password`, `role`)
- `POST /api/auth/login` — Login & obtain JWT Bearer token
- `GET /api/auth/me` — Get current user profile and journey statistics (Private)
- `PUT /api/auth/profile` — Update name or password (Private)

### Trains (`/api/trains`)
- `GET /api/trains` — Get all trains in database
- `GET /api/trains/search?from=&to=&date=` — Search trains by route and operating days
- `GET /api/trains/stations` — Get unique list of all stations for search autocomplete
- `GET /api/trains/:id` — Get single train with full station timeline
- `POST /api/trains` — Create new train with dynamic stations (Admin only)
- `PUT /api/trains/:id` — Update train schedule and stops (Admin only)
- `DELETE /api/trains/:id` — Delete train (Admin only)
- `PUT /api/trains/:id/status` — Update live station, next stop, delay, status (Admin only)

### Journeys (`/api/journeys`)
- `POST /api/journeys` — Start a new journey (Private)
- `GET /api/journeys/my` — Get authenticated user's journey history (Private)
- `GET /api/journeys/:id` — Get detailed journey progress and tracking (Private)
- `PUT /api/journeys/:id` — Update journey status (e.g. Completed) or reminder minutes (Private)
- `DELETE /api/journeys/:id` — Remove journey record (Private)

### Admin Statistics (`/api/admin`)
- `GET /api/admin/stats` — Aggregate metrics: Total Trains, Stations, Active Journeys, Delayed Trains (Admin only)

---

## Deployment Guide

### Deploying Backend to Render
1. Push your repository to GitHub.
2. Sign up on [Render.com](https://render.com) and click **New +** -> **Web Service**.
3. Connect your GitHub repository.
4. Set the following configuration:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. In **Environment Variables**, add:
   - `PORT`: `5000`
   - `MONGO_URI`: `your_mongodb_atlas_connection_string`
   - `JWT_SECRET`: `your_production_jwt_secret`
   - `NODE_ENV`: `production`
6. Click **Deploy Web Service** and copy your backend URL (e.g., `https://railtrack-api.onrender.com`).

### Deploying Frontend to Vercel
1. Sign up on [Vercel.com](https://vercel.com) and click **Add New Project**.
2. Import your GitHub repository.
3. In project settings:
   - **Root Directory**: Select `client`
   - **Framework Preset**: Vite
4. In **Environment Variables**, add:
   - `VITE_API_URL`: `https://railtrack-api.onrender.com/api` (your deployed Render URL)
5. Click **Deploy**. Vercel will bundle the application and apply `vercel.json` rewrite rules for React Router!

---

## Git Workflow Commands

To push this codebase to your own GitHub repository:
```bash
# 1. Initialize git
git init

# 2. Stage all files
git add .

# 3. Create initial commit
git commit -m "Initial commit: RAILTRACK full-stack MERN railway tracker"

# 4. Set default branch to main
git branch -M main

# 5. Connect your remote repository
git remote add origin https://github.com/your-username/railtrack.git

# 6. Push to GitHub
git push -u origin main
```

---

## Final Testing Checklist

- [x] User registration with validation (`/register`)
- [x] User login with JWT token issuance (`/login`)
- [x] One-click demo credentials for quick evaluation
- [x] Protected dashboard accessible only with valid JWT (`/dashboard`)
- [x] Search trains by Source and Destination (`/search`)
- [x] Intermediate stop sequence matching (source must precede destination)
- [x] Train details view with schedule summary (`/trains/:id`)
- [x] **Station-wise chronological vertical timeline** (`StationTimeline.jsx`)
- [x] Platform numbers and stop duration for each station
- [x] Scheduled vs. actual timing delay calculations
- [x] Active station glowing pulse and completed station indicators
- [x] Start journey document creation in MongoDB
- [x] My Journeys travel history and filtering (`/my-journeys`)
- [x] Complete journey status mutation
- [x] Simulated destination arrival alert notifications
- [x] User profile viewing and credential updates (`/profile`)
- [x] Admin authentication and role protection (`/admin/dashboard`)
- [x] Aggregate metrics cards (Trains, Stations, Active Trips, Delays)
- [x] Admin add train with dynamic station builder (`/admin/trains/add`)
- [x] Admin edit train and modify stations (`/admin/trains/edit/:id`)
- [x] Admin live status updater (current station, next stop, delay)
- [x] Delete train functionality
- [x] Fully responsive layout across Desktop, Tablet, and Mobile screens
