# Volunteer Registration System – Naye Pankh Foundation

A full-stack MERN (MongoDB, Express, React, Node) web application featuring a clean, responsive, and minimalist black-and-white design layout.

## Features

1. **Landing Page**: Information about Naye Pankh Foundation, its mission, vision, volunteer benefits, dynamically fetched application statistics (total vs. approved), and action triggers.
2. **Volunteer Registration Form**: Modern registration fields (Full Name, Email, Phone, Age, Skills, Availability, Commitment, and Motivation) with thorough client-side inputs verification and backend validation.
3. **Admin Portal Security**: Secure JWT authentication, password hashing using `bcryptjs`, and route guards protecting dashboard assets.
4. **Admin Dashboard**: Real-time counter metrics for application status (Total, Pending, Approved, and Rejected), interactive search bar (filtering by name, email, or skill tags), status filter dropdown, and CRUD control buttons (Approve, Reject, and Delete).
5. **Volunteer Details Drawer**: Responsive overlay details view exposing skills badges and complete application motivation text.
6. **Reports Downloader**: Secure client-side reports engine exporting volunteer collections in CSV and JSON file formats.

---

## Tech Stack

* **Frontend**: React + Vite, React Router, custom high-contrast monochrome CSS design system
* **Backend**: Node.js, Express.js (REST API architecture)
* **Database**: MongoDB with Mongoose ODM
* **Security**: JSON Web Tokens (JWT) & bcryptjs hashing

---

## Project Structure

```text
├── backend/
│   ├── config/
│   │   └── db.js            # MongoDB Connection config
│   ├── controllers/
│   │   ├── authController.js # Admin authentication and seeding
│   │   └── volunteerController.js # Registrations, metrics, and report builders
│   ├── middleware/
│   │   └── auth.js          # Token security verification
│   ├── models/
│   │   ├── Admin.js         # Admin collection schema
│   │   └── Volunteer.js     # Volunteer application schema
│   ├── routes/
│   │   ├── authRoutes.js    # Routes namespace /api/auth
│   │   └── volunteerRoutes.js # Routes namespace /api/volunteers
│   ├── .env                 # Backend local configuration env
│   ├── .env.example         # Sample environment file
│   ├── package.json         # Backend dependencies script
│   └── server.js            # Node service entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Navigation parts (Header, Footer, Router Guards)
│   │   ├── pages/           # Views (Landing, Apply Form, Login, Dashboard)
│   │   ├── App.jsx          # Route registry
│   │   ├── index.css        # Minimalist B&W styling definitions
│   │   └── main.jsx         # React mounting index
│   ├── index.html           # Main template
│   ├── package.json         # Frontend dependencies script
│   └── vite.config.js       # Vite bundler parameters
│
├── package.json             # Root-level orchestrator script
└── README.md                # System setup documentation
```

---

## Installation & Setup

### Prerequisites

* [Node.js](https://nodejs.org/) installed (v18+ recommended)
* [MongoDB](https://www.mongodb.com/) running locally or an Atlas connection URI

### 1. Configure Environment Variables

Create a file named `.env` inside the `backend` directory (copying `backend/.env.example` as a starting point) and adjust keys:

```ini
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/naye-pankh
JWT_SECRET=naye_pankh_secret_key_change_me_in_prod
ADMIN_EMAIL=admin@nayepankh.org
ADMIN_PASSWORD=admin123
```

> [!NOTE]
> On startup, the backend automatically checks if there are any administrator accounts. If none are found, a default administrator is seeded using the `ADMIN_EMAIL` and `ADMIN_PASSWORD` credentials declared in `.env`.

### 2. Install Project Dependencies

Run the custom install script at the root directory to fetch dependencies for both the frontend and backend:

```bash
npm run install-all
```

### 3. Run the Application

Start both the Node API server and Vite dev frontend concurrently with one command:

```bash
npm run dev
```

* **Frontend url**: `http://localhost:5173/`
* **Backend url**: `http://localhost:5000/`

---

## Default Admin Credentials

If using default configurations, you can access the admin dashboard using:

* **Email**: `admin@nayepankh.org`
* **Password**: `admin123`
