# Rural E-Grievance Portal

A complete MERN stack web application built for logging and tracking rural grievances, inspired by the official Government PG Portal. Designed with a clean, responsive UI and fully functional role-based access.

## Features

- **User Module**: Register, Login, Lodge Grievance, Track Complaints via unique ID, User Dashboard.
- **Admin Module**: Secure Admin Dashboard to view, filter, and update the status and remarks of grievances.
- **Responsive UI**: Fully styled with Tailwind CSS, accessible across all devices.

## Tech Stack

- **Frontend**: React.js (Vite), Tailwind CSS, React Router, Context API, Axios, Lucide Icons.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JSON Web Tokens (JWT), Bcrypt.

## Quick Start Guide

### 1. Prerequisites
- Node.js installed on your system.
- MongoDB installed locally or access to a MongoDB Atlas cluster.

### 2. Setup the Backend
1. Open a terminal and navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```
   (Make sure MongoDB is running on your localized default `mongodb://127.0.0.1:27017/e-grievance` or change the `MONGO_URI` accordingly).
4. Start the server (It will automatically seed the admin and a sample grievance):
   ```bash
   npm run dev
   ```

### 3. Setup the Frontend
1. Open a new terminal and navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### 4. Admin Credentials (Demo)
- **Phone Number**: `0000000000`
- **Password**: `admin`

## Folder Structure
```
e-grievance-portal/
├── client/          # React JS Frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
└── server/          # Node JS Backend
    ├── controllers/
    ├── models/
    ├── routes/
    ├── middleware/
    ├── server.js
    └── package.json
```
