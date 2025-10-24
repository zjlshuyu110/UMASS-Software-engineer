# UMASS Sports App Backend - Game/Match API

## Game/Match Features
- Create a game/match with any name and select a sport from a predefined list (enum)
- Invite other players by their email
- Invited players receive email notifications
- Players can accept or decline invitations
- Players can leave a game
- Creator can remove players
- Get all games a user is part of (created, invited, joined)

## User Model
- Fields: name, username (unique), email (unique), password, isVerified, otp, otpExpires, ...

## Auth Endpoints
- **Signup:** name, username, email, password required (username/email must be unique)
- **Login:** identifier (username or email) and password

## Endpoints

### Create Game
- **POST /api/games/create**
- Auth required (JWT in `x-auth-token` header)
- Body (form-data or JSON):
  - `name`: string (match name)
  - `sportType`: string (one of enum)
  - `inviteEmails`: array of emails (optional)
  - `inviteUsernames`: array of usernames (optional; will auto-resolve emails and invite)
- Response: `{ msg, game }`

### Accept Invitation
- **POST /api/games/accept**
- Auth required
- Body: `{ gameId }`
- Response: `{ msg, game }`

### Decline Invitation
- **POST /api/games/decline**
- Auth required
- Body: `{ gameId }`
- Response: `{ msg, game }`

### Leave Game
- **POST /api/games/leave**
- Auth required
- Body: `{ gameId }`
- Response: `{ msg, game }`

### Remove Player (Creator Only)
- **POST /api/games/remove**
- Auth required
- Body: `{ gameId, playerId }`
- Response: `{ msg, game }`

### Get My Games
- **GET /api/games/my**
- Auth required
- Response: `{ games }`

### Invite User to Game
- **POST /api/games/invite**
- Auth required (creator only)
- Body (form-data or JSON):
  - `gameId`: string (required)
  - `userEmail`: string (optional, either this or username required)
  - `username`: string (optional, either this or userEmail required)
- Response: `{ msg, game }`

### Search Games
- **GET /api/games/search**
- Query params (all optional):
  - `name`: partial match for game name (case-insensitive)
  - `sportType`: filter by sport
  - `status`: game status (open, in_progress, completed, cancelled)
  - `creatorUsername` or `creatorEmail`: only games created by this
  - `playerUsername` or `playerEmail`: only games where this user is/was a player
  - `invitedUsername` or `invitedEmail`: only games where this user was invited, with optional `inviteStatus`
  - `inviteStatus`: (optional, when used with invitedUsername/invitedEmail) pending, accepted, declined
  - `dateFrom`, `dateTo`: creation time range (ISO date string)
  - `page`, `pageSize`: pagination
- Response: `{ games }` (array of matched games)
- Example:
  - `/api/games/search?name=soccer&sportType=Soccer&page=1&pageSize=10`
  - `/api/games/search?playerUsername=johndoe&status=open`
  - `/api/games/search?invitedUsername=sarah42`
  - `/api/games/search?creatorUsername=coach12&name=frisbee`

## Sports Enum
```
Soccer, Basketball, Baseball, Football, Tennis, Volleyball, Cricket, Hockey, Rugby,
Table Tennis, Badminton, Golf, Softball, Lacrosse, Ultimate Frisbee, Track, Swimming,
Wrestling, Rowing, Field Hockey, Other
```

## User Profile APIs

### Get Profile
- **GET /api/users/profile**
- Auth required
- Response: `{ user }` (without password/otp fields)

### Edit Profile
- **PUT /api/users/profile**
- Auth required
- Body (form-data or JSON):
  - `name`: string (optional)
  - `username`: string (optional, must be unique)
  - `email`: string (optional, must be unique)
  - `currentPassword`: string (required if changing password)
  - `newPassword`: string (optional)
- Response: `{ msg, user }`

### Request to Join Game
- **POST /api/users/request-join**
- Auth required
- Body: `{ gameId }`
- Response: `{ msg }` (sends email to game creator)

## Notes
- All endpoints require a valid JWT in the `x-auth-token` header.
- Invitations are sent via email using the email in your .env file.
- Only the creator can remove players or cancel a game.
- Players can only join games they are invited to.

---
For more details, see the code in `src/controllers/gameController.js`, `src/routes/gameRoutes.js`, `src/controllers/userController.js`, and `src/routes/userRoutes.js`.
