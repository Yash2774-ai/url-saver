# URL Saver

URL Saver is a full-stack web application for storing, organizing, and quickly accessing saved websites. The application uses a React frontend for the user interface and an Express.js backend with MySQL for data persistence.

## Features

- Save website links with title, description, and category
- View saved websites in a categorized list
- Mark websites as favorites
- Browse saved entries from the frontend dashboard
- REST API for adding, listing, updating, and deleting URLs

## Tech Stack

### Frontend
- React 19
- Material UI
- Axios
- React Scripts

### Backend
- Node.js
- Express.js 5
- MySQL2
- CORS
- Body Parser

## Prerequisites

Before running the project, make sure you have:

- Node.js installed
- MySQL installed and running
- A MySQL database named `url_saver` or update the configuration in `backend/db.js`

## Project Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd "Url Saver"
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Install frontend dependencies

```bash
cd ../frontend
npm install
```

### 4. Configure the database

1. Open MySQL and create the database if needed.
2. Import the SQL schema from `DB.sql`.
3. Update database credentials in `backend/db.js` if your local MySQL settings differ.

Default configuration uses:

- Host: `localhost`
- Port: `3306`
- User: `root`
- Password: `SQLPassword`
- Database: `url_saver`

You can override these values with environment variables:

```bash
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=SQLPassword
DB_NAME=url_saver
```

## Running the Application

### Start the backend

```bash
cd backend
npm start
```

The backend runs on:

- `http://localhost:5000`

### Start the frontend

```bash
cd frontend
npm start
```

The frontend development server runs on:

- `http://localhost:3000`

## API Endpoints

The backend exposes the following routes under `/api/urls`:

- `GET /api/urls` — Fetch all saved URLs
- `GET /api/urls/stats` — Fetch total and favorite counts plus category breakdown
- `GET /api/urls/category/:category` — Fetch URLs by category
- `POST /api/urls` — Add a new URL
- `PUT /api/urls/:id` — Update a URL
- `PATCH /api/urls/:id/favorite` — Toggle a favorite flag
- `DELETE /api/urls/:id` — Delete a URL

## Project Structure

```text
Url Saver/
├── backend/
│   ├── db.js
│   ├── package.json
│   ├── server.js
│   └── routes/
│       └── urlRoutes.js
├── frontend/
│   ├── package.json
│   ├── public/
│   └── src/
├── DB.sql
└── README.md
```

## Available Scripts

### Backend
- `npm start` — Start the Express server

### Frontend
- `npm start` — Start the development server
- `npm run build` — Build the production bundle
- `npm test` — Run frontend tests

## License

This project is licensed under the ISC License.

