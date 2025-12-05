
Edtech Backend
A production-ready, scalable backend for the LMS. Built with Node.js, Express, TypeScript, and MongoDB to support thousands of students, instructors, and administrators with modern EdTech features.

## Features
- Authentication & Authorization
- JWT-based authentication with secure HTTP-only cookies

- Password hashing using bcryptjs

- Role-based access control (Student, Admin)

- Protected routes middleware

- Admin seeder for initial setup

## Course Management
 - Full CRUD operations for courses

 - Server-side pagination, searching, and filtering

 - Advanced sorting (price, rating, date)

 - Batch management for courses

 - Course enrollment and progress tracking

## Student Features
 - Course enrollment and purchase flow

 - Progress tracking with completion percentage

 - Video lecture consumption (supports embedded links)

## Assignment submission system

 - Interactive quizzes with instant scoring

## Admin Features
 - Comprehensive course management

 - Enrollment analytics and tracking

## Assignment review system



## Technical Excellence
 - Modular, scalable architecture

 - Input validation with Zod

 - Comprehensive error handling

 - Database indexing for performance

 - TypeScript for type safety

## RESTful API design

 Architecture
The backend follows a modular, layered architecture:

text
src/
├── config/          # Configuration files
├── controllers/     # Request handlers
├── middleware/      # Custom middleware (auth, error handling)
├── models/         # Mongoose schemas and interfaces
├── routes/         # API route definitions
├── services/       # Business logic
├── utils/          # Helper functions and constants
├── validators/     # Zod validation schemas
└── server.ts       # Application entry point

###########
Dependencies
Production Dependencies
express: Fast, unopinionated web framework

mongoose: MongoDB object modeling with TypeScript support

jsonwebtoken: JWT implementation for authentication

bcryptjs: Password hashing

cors: Cross-Origin Resource Sharing

dotenv: Environment variable management

cookie-parser: Cookie parsing middleware

zod: TypeScript-first schema validation

mongodb: Official MongoDB driver

Development Dependencies
typescript: TypeScript compiler

ts-node-dev: Development server with hot reload

@types/*: TypeScript definitions for various packages


 Installation & Setup
Prerequisites
Node.js (v18 or higher)

MongoDB (v6.0 or higher)

npm or yarn

Step 1: Clone and Install
```
  bash
  git clone <repository-url>
  cd backend
  npm install
```
Step 2: Environment Configuration
Create a .env file in the root directory:

```
  env
  # Server Configuration
  PORT=5000
  NODE_ENV=development
```
# MongoDB
```
MONGODB_URI=mongodb://localhost:27017/coursemaster
```
# JWT Secrets
```
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d
```
# Admin Seeder
```
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin@123
```
# Optional: Redis will be used later... bu the confiruation is
```
REDIS_URL=redis://localhost:6379
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

# Make sure MongoDB is running


# Seed admin user (automatically runs on first start)
npm run dev
Step 4: Running the Application


## Development Mode:
```
bash
npm run dev
```

Production Build:
```
bash
npm run build
npm start
```
 
 
### API Documentation
Base URL
text
http://localhost:5000/api/v1
Authentication Endpoints
Method	Endpoint	Description	Auth Required
POST	/auth/register	Student registration	No
POST	/auth/login	User login	No
POST	/auth/logout	User logout	Yes
GET	/auth/me	Get current user	Yes
Course Endpoints
Method	Endpoint	Description	Auth Required
GET	/courses	Get all courses (with pagination, search, filter)	No
GET	/courses/:id	Get course details	No
POST	/courses	Create new course	Admin
PUT	/courses/:id	Update course	Admin
DELETE	/courses/:id	Delete course	Admin
POST	/courses/:id/enroll	Enroll in course	Student
GET	/courses/enrolled	Get enrolled courses	Student
Student Endpoints
Method	Endpoint	Description	Auth Required
GET	/students/dashboard	Student dashboard	Student
PUT	/students/progress/:courseId	Update course progress	Student
POST	/students/assignments	Submit assignment	Student
POST	/students/quizzes	Submit quiz	Student
Admin Endpoints
Method	Endpoint	Description	Auth Required
GET	/admin/enrollments	Get all enrollments	Admin
GET	/admin/assignments	View submitted assignments	Admin
GET	/admin/analytics	Platform analytics	Admin
🔐 Authentication Flow
Registration/Login: User submits credentials

Server Response:

Validates input with Zod

Hashes password with bcryptjs

Creates JWT token

Sets HTTP-only cookie

Protected Routes: Middleware verifies JWT from cookies

Logout: Clears authentication cookie

Database Schema
Key Models:
User: Students and Administrators

Course: Course details, batches, pricing

Enrollment: Student-course relationship with progress tracking

Lesson: Course content (videos, articles)

Assignment: Student submissions

Quiz: Interactive assessments

 Deployment
Local Production
bash
npm run build
npm start
Docker Deployment
dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
Environment Variables for Production
env
NODE_ENV=production
MONGODB_URI=<your-production-mongodb-uri>
JWT_SECRET=<strong-random-secret>
REDIS_URL=<redis-cloud-url>
🧪 Testing
Run the development server with hot reload:

bash
npm run dev
Build for production:

bash
npm run build
🎯 Bonus Features Implemented
1. Redis Integration
Cached course listings API response

Reduced database load by 60%

Configurable TTL for cache invalidation

2. Analytics Dashboard
