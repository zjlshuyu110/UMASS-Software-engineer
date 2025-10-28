# UMASS-Software-engineer

## Project Overview
This is a mobile app that allows UMass students to host, search for, and participate in sports teams and competitions. Our app aims to streamlines sports game organization at UMass (communication, scheduling, basic stats, etc). The frontend is built with React Native to support both iOS and Android. The backend is built with Node.js, Express, MongoDB, and follows the MVC pattern.

## Prerequisites
1. Have an iOS or Android emulator
   * iOS: Follow expo's official documentation for [iOS Simulator](https://docs.expo.dev/workflow/ios-simulator/)
   * Android: Follow expo's official documentation for [Android Emulator](https://docs.expo.dev/workflow/android-studio-emulator/)

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

## Frontend Setup
1. Clone the repo and install dependencies:
   ```bash
   npm install
   ```
2. Launch development server:
   ```bash
   npx expo start
   ```
4. Follow the terminal instructions to start the emulator/simulator, press `a` for Android emulator and `i` for iOS simulator.
5. Alternatively, install the Expo Go app on your phone and scan the QR code in the terminal after launching the development server.

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
