# Recipe Management System

This is a full-stack application for managing recipes and categories.

## Project Structure

- `/backend` - Node.js/Express backend with MySQL database
- `/frontend` - React frontend application

## Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Database Setup:
   - Create a MySQL database
   - Copy `config/config.example.json` to `config/config.json`
   - Update the database credentials in `config/config.json`

4. Run migrations:
```bash
npx sequelize-cli db:migrate
```

5. Start the development server:
```bash
npm start
```

The backend server will run on http://localhost:3000

## Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on http://localhost:3001

## Environment Variables

Create a `.env` file in the backend directory with the following variables:
```
JWT_SECRET=your_secret_key
NODE_ENV=development
```

## API Endpoints

- POST `/api/register` - Register a new user
- POST `/api/login` - Login user
- GET `/api/categories` - Get all categories
- POST `/api/categories` - Create a new category
- GET `/api/recipes` - Get all recipes
- POST `/api/recipes` - Create a new recipe
- GET `/api/statistics/avg-kcal-per-category` - Get average calories per category 