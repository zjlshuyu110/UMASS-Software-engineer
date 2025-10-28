# UMASS-Software-engineer

## Project Overview
This is a mobile app that allows UMass students to host, search for, and participate in sports teams and competitions. Our app aims to streamlines sports game organization at UMass (communication, scheduling, basic stats, etc). The frontend is built with React Native to support both iOS and Android. The backend is built with Node.js, Express, MongoDB, and follows the MVC pattern.

## Backend Setup
1. Clone the repo and install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file with:
   ```env
   MONGO_URI=mongodb://localhost:27017/umass_sports
   JWT_SECRET=your_jwt_secret_here
   PORT=5050
   ```
3. Start the server:
   ```bash
   npm run dev
   ```

## API Endpoints
### Auth
- **POST /api/auth/signup**
  - Body: `{ name, email, password }`
  - Response: `{ token }` (JWT)
- **POST /api/auth/login**
  - Body: `{ email, password }`
  - Response: `{ token }` (JWT)

### Auth Middleware
- Protected routes require `x-auth-token` header with the JWT.

## Testing
- Run tests with:
  ```bash
  npm test
  ```

## Folder Structure
- `src/models` - Mongoose models
- `src/controllers` - Route logic
- `src/routes` - Express routers
- `src/middlewares` - Middleware (e.g., auth)
- `src/config` - DB config
- `src/tests` - Jest/Supertest tests

---
This is a basic starter. Extend with more features (sports, matchmaking, chat, etc.) as needed!
