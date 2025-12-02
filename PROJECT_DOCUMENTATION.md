# UMASS Sports App - Project Documentation

## 📋 Table of Contents
- [Project Overview](#project-overview)
- [Features Implemented](#features-implemented)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Screenshots & Demo](#screenshots--demo)

---


---


### 1. **Complete Game Management** ✅
- **Create Games**: Users can create sports games with details like name, sport type, location, time, and max players
- **Invite Players**: Send email invitations to other users
- **Accept/Decline Invitations**: Invited players receive notifications and can respond
- **Join/Leave Games**: Players can join open games or leave games they've joined
- **Remove Players**: Game creators can remove players from their games
- **View My Games**: See all games you've created, joined, or been invited to

**Backend APIs:**
- `POST /api/games/create` - Create a new game
- `POST /api/games/accept` - Accept invitation
- `POST /api/games/decline` - Decline invitation
- `POST /api/games/leave` - Leave a game
- `POST /api/games/remove` - Remove player (creator only)
- `GET /api/games/my` - Get user's games

### 2. **Game Search & Discovery** ✅
- **Search by Name**: Text-based search with fuzzy matching
- **Filter by Sport**: Click sport category icons to filter games (Basketball, Soccer, Volleyball, etc.)
- **Combined Filters**: Search text + sport type filtering
- **Real-time Results**: Instant search results with loading states
- **Smart Fallback**: Demo games shown when database is empty
- **Empty State Handling**: User-friendly messages when no results found

**Backend APIs:**
- `GET /api/games/all` - Get all open games (up to 50, sorted by date)
- `GET /api/games/search?sport=Basketball&name=tournament&location=UMass` - Advanced search

**Demo Data Includes:**
- 6 sample games across different sports
- Realistic game details (locations, player counts, times)
- Visual indicators for demo vs real data

### 3. **Profile Builder** ✅
- **Create Profile**: First-time profile setup
- **View Profile**: Display user information and sport interests
- **Edit Profile**: Update name, age, sport interests, and skill levels
- **Sport Interests**: Add/remove sports with skill level ratings (Beginner/Intermediate/Advanced)
- **Profile Picture**: Display avatar (upload feature pending)
- **Validation**: Required field checks and error handling

**Backend APIs:**
- `GET /api/profile/check` - Check if profile exists
- `POST /api/profile` - Create profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update profile

### 4. **Messaging/Inbox System** ✅
- **Conversation List**: View all message conversations
- **Unread Indicators**: Visual badges showing unread message counts
- **Message Preview**: See last message in each conversation
- **Game Invitations**: Special formatting for game invite messages
- **Time Display**: Smart time formatting (2h ago, Yesterday, Dec 1)
- **Demo Messages**: 4 sample conversations for testing

**Backend APIs:**
- `POST /api/messages/send` - Send a message
- `GET /api/messages/conversations` - Get all conversations
- `GET /api/messages/conversation/:userId` - Get messages with specific user
- `GET /api/messages/unread-count` - Get unread count
- `PUT /api/messages/mark-read/:messageId` - Mark as read

### 5. **Authentication System** ✅
- **User Registration**: Sign up with name, email, password
- **Email Verification**: OTP (One-Time Password) sent via email
- **Login**: Secure JWT-based authentication
- **Token Management**: 7-day token expiration
- **Password Security**: bcrypt hashing

**Backend APIs:**
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/verify` - Verify OTP code
- `POST /api/auth/login` - User login

### 6. **Email Notifications** ✅
- **OTP Verification**: Email with 6-digit verification code
- **Game Invitations**: Automatic email when invited to games
- **Gmail Integration**: SMTP service for reliable delivery
- **Rate Limits**: 500 emails/day (suitable for development)

---


### Backend
- **Runtime**: Node.js v18+
- **Framework**: Express.js
- **Database**: MongoDB Atlas (Cloud)
- **Authentication**: JWT (JSON Web Tokens)
- **Email Service**: Nodemailer + Gmail SMTP
- **Password Hashing**: bcrypt
- **File Upload**: Multer (prepared for image uploads)

### Frontend
- **Framework**: React Native (Expo)
- **Navigation**: Expo Router
- **State Management**: Redux Toolkit
- **HTTP Client**: Axios
- **UI Components**: React Native Paper elements
- **Styling**: NativeWind (Tailwind CSS)
- **Icons**: Expo Vector Icons (Ionicons, Material Icons)

### Development Tools
- **API Testing**: Postman/Thunder Client
- **Version Control**: Git + GitHub
- **Code Editor**: VS Code
- **Package Manager**: npm

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:
- **Node.js** (v18 or higher): [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git**: [Download](https://git-scm.com/)
- (Optional) **Expo Go** app on your phone for mobile testing

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/zjlshuyu110/UMASS-Software-engineer.git
cd UMASS-Software-engineer
```

#### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file (already exists, but verify these settings)
# The file should contain:
# PORT=5050
# MONGO_URI=mongodb+srv://kenneth:verydifficultpassword@cluster0.coiqjhd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
# JWT_SECRET=jwt_secret
# EMAIL_USER=sahilkamath0108@gmail.com
# EMAIL_PASS="qyod rzfd cyru pthw"

# Start backend server
npm run dev
```

**Expected Output:**
```
[nodemon] 3.1.10
[nodemon] starting `node src/app.js`
Server started on port 5050
MongoDB connected
```

#### 3. Frontend Setup

Open a **new terminal** (keep backend running):

```bash
# Navigate to frontend directory
cd SportsMatchFrontend

# Install dependencies
npm install

# Start Expo development server
npm start
# OR
npx expo start
```

**Expected Output:**
```
Starting Metro Bundler
› Metro waiting on exp://172.31.26.168:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)
› Web is waiting on http://localhost:8081
```

#### 4. Access the Application

**Option A: Web Browser (Easiest)**
1. Press `w` in the terminal
2. OR visit `http://localhost:8081` in your browser

**Option B: Mobile Phone**
1. Install **Expo Go** from App Store (iOS) or Play Store (Android)
2. Scan the QR code shown in terminal
3. App will open in Expo Go

**Option C: Android Emulator**
1. Install Android Studio with emulator
2. Press `a` in the terminal

---

## 📡 API Documentation

### Base URL
```
http://localhost:5050/api
```

### Authentication
All protected endpoints require JWT token in header:
```
Headers: {
  'x-auth-token': 'your-jwt-token-here'
}
```

### Endpoints Summary


#### Games
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/games/create` | Create game | ✅ |
| POST | `/games/accept` | Accept invitation | ✅ |
| POST | `/games/decline` | Decline invitation | ✅ |
| POST | `/games/leave` | Leave game | ✅ |
| POST | `/games/remove` | Remove player | ✅ |
| GET | `/games/my` | Get user's games | ✅ |
| GET | `/games/all` | Get all open games | ✅ |
| GET | `/games/search` | Search games | ✅ |

#### Profile
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/profile/check` | Check profile exists | ✅ |
| POST | `/profile` | Create profile | ✅ |
| GET | `/profile` | Get profile | ✅ |
| PUT | `/profile` | Update profile | ✅ |

#### Messages
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/messages/send` | Send message | ✅ |
| GET | `/messages/conversations` | Get all conversations | ✅ |
| GET | `/messages/conversation/:userId` | Get chat history | ✅ |
| GET | `/messages/unread-count` | Get unread count | ✅ |
| PUT | `/messages/mark-read/:messageId` | Mark as read | ✅ |

### Example API Calls

**Register New User:**
```bash
POST http://localhost:5050/api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Search Games:**
```bash
GET http://localhost:5050/api/games/search?sport=Basketball&name=tournament
Headers: {
  "x-auth-token": "your-jwt-token"
}
```

**Create Game:**
```bash
POST http://localhost:5050/api/games/create
Headers: {
  "x-auth-token": "your-jwt-token"
}
Content-Type: application/json

{
  "name": "Basketball Tournament",
  "sportType": "Basketball",
  "location": "UMass Rec Center",
  "startAt": "2025-12-05T18:00:00Z",
  "maxPlayers": 10,
  "inviteEmails": ["friend@example.com"]
}
```

---

## 📁 Project Structure

```
UMASS-Software-engineer/
├── backend/                          # Backend Server (Node.js + Express)
│   ├── src/
│   │   ├── models/                   # MongoDB Models
│   │   │   ├── User.js              # User schema (auth, profile)
│   │   │   ├── Game.js              # Game schema
│   │   │   └── Message.js           # Message schema
│   │   ├── controllers/              # Business Logic
│   │   │   ├── authController.js    # Auth operations
│   │   │   ├── gameController.js    # Game CRUD + search
│   │   │   ├── profileController.js # Profile management
│   │   │   └── messageController.js # Messaging system
│   │   ├── routes/                   # API Routes
│   │   │   ├── authRoutes.js
│   │   │   ├── gameRoutes.js
│   │   │   ├── profileRoutes.js
│   │   │   └── messageRoutes.js
│   │   ├── middlewares/              # Custom Middleware
│   │   │   └── authMiddleware.js    # JWT verification
│   │   ├── config/                   # Configuration
│   │   │   └── db.js                # MongoDB connection
│   │   └── app.js                   # Express app setup
│   ├── .env                         # Environment variables
│   └── package.json
│
├── SportsMatchFrontend/             # Frontend (React Native + Expo)
│   ├── app/                         # App screens (Expo Router)
│   │   ├── (tabs)/                  # Tab navigation
│   │   │   ├── discover.tsx         # Game discovery + search
│   │   │   ├── games.tsx            # My games list
│   │   │   ├── inbox.tsx            # Messages/inbox
│   │   │   └── profile.tsx          # User profile
│   │   ├── gameDetails/             # Game detail screens
│   │   │   ├── index.tsx            # View game details
│   │   │   └── newGame.tsx          # Create new game
│   │   ├── profile/                 # Profile screens
│   │   │   └── editProfile.tsx      # Edit profile form
│   │   ├── login/                   # Auth screens
│   │   │   └── index.tsx
│   │   └── signup/
│   │       └── index.tsx
│   ├── src/
│   │   ├── apiCalls/                # API Service Layer
│   │   │   ├── auth.ts              # Auth API calls
│   │   │   ├── game.ts              # Game API calls
│   │   │   ├── profile.ts           # Profile API calls
│   │   │   └── message.ts           # Message API calls
│   │   ├── components/              # Reusable Components
│   │   │   ├── ui/
│   │   │   │   └── game-card.tsx    # Game card component
│   │   │   ├── signup/
│   │   │   │   ├── sign-up-form.tsx
│   │   │   │   └── verify-otp.tsx
│   │   │   └── games/
│   │   │       └── game-player-card.tsx
│   │   ├── redux/                   # State Management
│   │   │   ├── slices/
│   │   │   │   ├── userSlice.ts     # User state
│   │   │   │   └── counterSlice.ts
│   │   │   └── store/
│   │   │       └── index.ts
│   │   ├── models/                  # TypeScript Interfaces
│   │   │   └── Game.ts
│   │   └── utils/                   # Utility Functions
│   │       ├── token.ts             # Token management
│   │       └── date-utils.ts
│   ├── assets/                      # Static Assets
│   │   └── images/                  # Sport icons, logos
│   ├── constants/                   # App Constants
│   │   ├── game.ts                  # Sport types
│   │   ├── skillLevels.ts           # Skill levels
│   │   └── theme.ts                 # Colors, typography
│   ├── env.ts                       # API URL config
│   └── package.json
│
└── README.md                        # This file
```

---

## 🎨 Screenshots & Demo

### Features Showcase

**1. Game Discovery & Search**
- Search bar with real-time filtering
- Sport category icons (Basketball, Soccer, Volleyball, etc.)
- Game cards showing sport type, location, player count, time
- Demo data when database is empty
- "Showing demo games" indicator

**2. My Games**
- Horizontal scrollable game cards
- "Today" and "This Week" sections
- "+" button to create new games
- Easy navigation to game details

**3. Create Game**
- Sport type selection dropdown
- Name, location, max players inputs
- Date/time picker
- Email invitation system
- Invite multiple players
- Form validation

**4. Profile Management**
- Display picture (placeholder + upload button)
- Name and age fields
- Sport interests with skill levels
- Add/remove sports dynamically
- Skill level selector (Beginner/Intermediate/Advanced)
- Save and validation

**5. Inbox/Messages**
- Conversation list with avatars
- Unread message badges
- Last message preview
- Smart time display (2h ago, Yesterday, Dec 1)
- Game invitation indicators (🎮)
- Demo conversations

**6. Authentication**
- Sign up form with validation
- Email OTP verification
- Login screen
- Error handling and feedback
- Secure token storage

---

## 🧪 Testing Guide

### 1. Test Authentication Flow
```
1. Click "Sign Up"
2. Fill form: Name, Email, Password
3. Submit → Check email for OTP code
4. Enter 6-digit OTP → Auto login
5. Should redirect to Discover page
```

### 2. Test Game Search
```
1. Go to "Discover" tab
2. Enter "tournament" in search box → Click Search
3. Should show only games with "tournament" in name
4. Click "Basketball" icon → Only basketball games shown
5. Click "Clear all" → Show all games again
```

### 3. Test Game Creation
```
1. Go to "Games" tab
2. Click "+" button (top right)
3. Fill form:
   - Name: "My Test Game"
   - Sport: "Basketball"
   - Location: "UMass Gym"
   - Max Players: 10
   - (Optional) Add invitation emails
4. Submit → Should see success message
5. New game appears in "My Games"
```

### 4. Test Profile
```
1. Go to "Profile" tab
2. If no profile → Click "Create Profile"
3. Fill age and sport interests
4. Add sport → Select skill level
5. Save → Profile displayed
6. Click "Edit" → Modify and save again
```

### 5. Test Inbox
```
1. Go to "Inbox" tab
2. Should see 4 demo conversations
3. Unread messages have badges (2, 1)
4. Click any conversation → "Coming soon" alert
5. (Real chat coming in next sprint)
```

---

### Current Limitations
1. **Image Upload**: Profile picture upload not yet implemented (displays placeholder)
2. **Chat Details**: Clicking inbox conversations shows placeholder (full chat UI pending)
3. **Real-time Updates**: No WebSocket implementation (manual refresh needed)
4. **Notifications**: Push notifications not implemented
5. **Game Editing**: Can create games but cannot edit after creation
6. **Delete Game**: No delete functionality yet





## 📝 Environment Variables

The `.env` file in backend directory contains:

```env
# Server Configuration
PORT=5050

# MongoDB Atlas Connection
MONGO_URI=mongodb+srv://kenneth:verydifficultpassword@cluster0.coiqjhd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

# JWT Secret (for token generation)
JWT_SECRET=jwt_secret

# Gmail SMTP Configuration (for emails)
EMAIL_USER=sahilkamath0108@gmail.com
EMAIL_PASS="qyod rzfd cyru pthw"





