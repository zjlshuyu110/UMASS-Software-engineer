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

---

# UMASS Sports Match - （Draft set up/run instructions）

## 🏀 Project Overview
A comprehensive mobile application designed for UMass students to organize, discover, and participate in sports games and competitions. The app streamlines the entire sports game lifecycle from creation to participation, including player matching, scheduling, communication, and notifications.

### Tech Stack
- **Frontend**: React Native (Expo ~54.0.10), TypeScript, Redux Toolkit, NativeWind (TailwindCSS)
- **Backend**: Node.js, Express.js, MongoDB Atlas (Cloud), JWT Authentication
- **Key Libraries**: expo-router, expo-image-picker, @reduxjs/toolkit, mongoose, bcryptjs

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)
- Expo Go app on your mobile device (iOS/Android)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file in backend directory:**
   ```env
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/umass_sports
   JWT_SECRET=your_secure_jwt_secret_here
   PORT=5050
   ```

4. **Start the backend server:**
   ```bash
   npm run dev
   ```
   Server will run on `http://localhost:5050`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd SportsMatchFrontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure backend API URL in `env.ts`:**
   ```typescript
   export const API_URL = 'http://localhost:5050'; // or your backend URL
   ```

4. **Start Expo development server:**
   ```bash
   npx expo start
   ```

5. **Run on device:**
   - Scan QR code with Expo Go app (iOS/Android)
   - Or press `a` for Android emulator / `i` for iOS simulator

---

## 📱 Features

### Authentication & Profile Management
- User registration with email verification
- Secure login with JWT tokens (7-day expiration)
- Profile creation and editing
- Photo upload with Base64 encoding (1:1 aspect ratio, 50% compression)
- Skill level selection (Beginner, Intermediate, Advanced, Expert)

### Game Management
- Create sports games with details:
  - Sport type (Basketball, Soccer, Tennis, Volleyball, etc.)
  - Location (with address)
  - Date and time
  - Player requirements (min/max players, skill level)
- Browse and search games by sport type
- View game details with creator and participant information
- Join/leave games
- Real-time player count updates

### Discovery & Search
- Discover upcoming games on dedicated page
- Filter games by sport type
- View game cards with key information
- Search functionality for finding specific games

### Communication & Notifications
- In-app notification system
- Game join/leave notifications
- Real-time notification updates
- Message system for player communication

### User Interface
- Tab-based navigation (Discover, Games, Inbox, Profile)
- Responsive design with NativeWind/TailwindCSS
- Theme support with custom color schemes
- Smooth animations and haptic feedback

---

## 🗂️ Project Structure

```
UMASS-Software-engineer/
├── backend/
│   ├── src/
│   │   ├── app.js                 # Express app entry point
│   │   ├── config/
│   │   │   └── db.js              # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── authController.js  # Auth logic (signup, login)
│   │   │   ├── gameController.js  # Game CRUD operations
│   │   │   ├── messageController.js
│   │   │   └── profileController.js
│   │   ├── middlewares/
│   │   │   └── authMiddleware.js  # JWT verification
│   │   ├── models/
│   │   │   ├── User.js            # User schema
│   │   │   ├── Game.js            # Game schema
│   │   │   └── Message.js         # Message schema
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── gameRoutes.js
│   │   │   ├── messageRoutes.js
│   │   │   └── profileRoutes.js
│   │   └── tests/
│   │       ├── auth.test.js
│   │       └── game.test.js
│   ├── package.json
│   └── README.md
│
├── SportsMatchFrontend/
│   ├── app/
│   │   ├── _layout.tsx            # Root layout
│   │   ├── index.jsx              # Welcome screen
│   │   ├── (tabs)/                # Main tab navigation
│   │   │   ├── discover.tsx       # Discover games page
│   │   │   ├── games.tsx          # My games page
│   │   │   ├── inbox.tsx          # Messages/Notifications
│   │   │   └── profile.tsx        # User profile
│   │   ├── gameDetails/
│   │   │   ├── index.tsx          # Game details view
│   │   │   └── newGame.tsx        # Create game form
│   │   ├── login/
│   │   │   └── index.tsx          # Login screen
│   │   ├── signup/
│   │   │   └── index.tsx          # Signup screen
│   │   └── profile/
│   │       └── editProfile.tsx    # Edit profile with photo upload
│   ├── src/
│   │   ├── apiCalls/              # API integration
│   │   │   ├── auth.ts
│   │   │   ├── game.ts
│   │   │   ├── message.ts
│   │   │   └── profile.ts
│   │   ├── components/            # Reusable components
│   │   │   ├── games/
│   │   │   │   └── game-player-card.tsx
│   │   │   └── ui/
│   │   │       └── game-card.tsx
│   │   ├── redux/
│   │   │   ├── slices/
│   │   │   │   └── userSlice.ts   # User state management
│   │   │   └── store/
│   │   │       └── index.ts       # Redux store config
│   │   └── utils/
│   │       ├── date-utils.ts      # Date formatting
│   │       └── token.ts           # Token storage
│   ├── constants/
│   │   ├── game.ts                # Sport types and constants
│   │   ├── skillLevels.ts         # Skill level definitions
│   │   └── theme.ts               # App theme colors
│   ├── package.json
│   └── README.md
│
├── PROJECT_DOCUMENTATION.md       # Detailed project docs
└── README.md                      # This file
```

---

## 🔌 API Endpoints

### Authentication
- **POST** `/api/auth/signup`
  - Body: `{ name, email, password }`
  - Response: `{ token, user }`
  
- **POST** `/api/auth/login`
  - Body: `{ email, password }`
  - Response: `{ token, user }`

### Profile Management (Protected)
- **POST** `/api/profile/create`
  - Headers: `x-auth-token: <JWT>`
  - Body: `{ location, skillLevel, interests, display_picture }`
  - Response: `{ profile }`
  
- **PUT** `/api/profile/update`
  - Headers: `x-auth-token: <JWT>`
  - Body: `{ location, skillLevel, interests, display_picture }`
  - Response: `{ profile }`
  
- **GET** `/api/profile/:userId`
  - Response: `{ profile }`

### Game Management (Protected)
- **POST** `/api/games/create`
  - Headers: `x-auth-token: <JWT>`
  - Body: `{ sportType, location, date, minPlayers, maxPlayers, skillLevel }`
  - Response: `{ game }`
  
- **GET** `/api/games`
  - Response: `{ games }` (all games)
  
- **GET** `/api/games/:id`
  - Response: `{ game }` (with creator and participants populated)
  
- **GET** `/api/games/sport/:sportType`
  - Response: `{ games }` (filtered by sport type)
  
- **POST** `/api/games/:id/join`
  - Headers: `x-auth-token: <JWT>`
  - Response: `{ game }` (updated with new participant)
  
- **POST** `/api/games/:id/leave`
  - Headers: `x-auth-token: <JWT>`
  - Response: `{ game }` (updated without participant)

### Messages/Notifications (Protected)
- **POST** `/api/messages/send`
  - Headers: `x-auth-token: <JWT>`
  - Body: `{ recipient, content }`
  - Response: `{ message }`
  
- **GET** `/api/messages/inbox`
  - Headers: `x-auth-token: <JWT>`
  - Response: `{ messages }`

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

Tests include:
- Authentication (signup, login, token validation)
- Game creation and retrieval
- Protected route authorization

### Manual Testing Checklist
- [ ] User signup and login flow
- [ ] Profile creation with photo upload
- [ ] Game creation with all fields
- [ ] Game search and filtering
- [ ] Join/leave game functionality
- [ ] Notification system
- [ ] Message system

---

## 🔐 Security Features
- Password hashing with bcrypt
- JWT-based authentication
- Token expiration (7 days)
- Protected API routes with auth middleware
- Input validation on backend
- Secure storage of sensitive data (MongoDB Atlas)

---

## 📝 Development Notes

### Image Upload Implementation
- Uses `expo-image-picker` for photo selection
- Images compressed to 50% quality
- 1:1 aspect ratio enforced for profile pictures
- Base64 encoding for storage (no cloud storage required)
- Permission handling for media library access

### State Management
- Redux Toolkit for global state
- User authentication state persisted
- Token storage with SecureStore (planned)

### Known Issues & Future Improvements
- Search function in `gameController.js` needs `populate()` for user details
- Date filtering should exclude past games
- Consider cloud storage for images (AWS S3, Cloudinary) for production
- Implement real-time updates with WebSocket
- Add push notifications
- Implement chat functionality

---

## 👥 Contributors
UMass CS520 Software Engineering Team

---

## 📄 License
MIT License - See LICENSE file for details
