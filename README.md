# URL Saver

URL Saver is a full-stack web application designed to help users manage and save their favorite URLs efficiently. The project is built using a React-based frontend and an Express.js backend, with MySQL as the database.

## Features

- Save and manage URLs with ease.
- View a list of saved URLs.
- Responsive and user-friendly interface.
- Backend API for managing URL data.

## Tech Stack

### Frontend
- **React**: A JavaScript library for building user interfaces.
- **Material-UI**: A popular React UI framework for styling.
- **Axios**: For making HTTP requests.

### Backend
- **Express.js**: A web application framework for Node.js.
- **MySQL**: A relational database for storing URL data.
- **Body-Parser**: Middleware for parsing incoming request bodies.
- **CORS**: Middleware for enabling Cross-Origin Resource Sharing.

## Prerequisites

- **Node.js**: Ensure you have Node.js installed on your system.
- **MySQL**: Set up a MySQL database.

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Url-Saver
  2. Install dependencies for the backend:
   cd backend
npm install
3.Install dependencies for the frontend:
cd ../frontend
npm install
4.Set up the database:

Import the DB.sql file into your MySQL database.
Update the database connection details in backend/db.js.
Usage
Running the Backend
1.Navigate to the backend directory
cd backend
2.Start the server:
node server.js
Running the Frontend
1.Navigate to the frontend directory:
cd frontend
2.tart the development server:
npm start
Project Structure
Url-Saver/
├── backend/
│   ├── db.js
│   ├── package.json
│   ├── server.js
│   └── routes/
│       └── urlRoutes.js
├── frontend/
│   ├── package.json
│   ├── public/
│   │   ├── index.html
│   │   ├── manifest.json
│   │   └── robots.txt
│   ├── src/
│   │   ├── components/
│   │   │   ├── SavedWebsites.js
│   │   │   └── UrlManager.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── ...
├── DB.sql
└── To Run Project.txt
Scripts
Backend
npm start: Start the backend server.
Frontend
npm start: Start the development server.
npm run build: Build the frontend for production.
npm test: Run tests.
License
This project is licensed under the ISC License.

Acknowledgments
React
Material-UI
Express.js
MySQL
