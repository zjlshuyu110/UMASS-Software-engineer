# UMASS Sports App Backend - Game/Match API

## Game/Match Features
- Create a game/match with any name and select a sport from a predefined list (enum)
- Invite other players by their email
- Invited players receive email notifications
- Players can accept or decline invitations
- Players can leave a game
- Creator can remove players
- Get all games a user is part of (created, invited, joined)

## Endpoints

### Create Game
- **POST /api/games/create**
- Auth required (JWT in `x-auth-token` header)
- Body (form-data or JSON):
  - `name`: string (match name)
  - `sportType`: string (one of enum)
  - `inviteEmails`: array of emails (optional)
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

## Sports Enum
```
Soccer, Basketball, Baseball, Football, Tennis, Volleyball, Cricket, Hockey, Rugby,
Table Tennis, Badminton, Golf, Softball, Lacrosse, Ultimate Frisbee, Track, Swimming,
Wrestling, Rowing, Field Hockey, Other
```

## Notes
- All endpoints require a valid JWT in the `x-auth-token` header.
- Invitations are sent via email using the email in your .env file.
- Only the creator can remove players or cancel a game.
- Players can only join games they are invited to.

---
For more details, see the code in `src/controllers/gameController.js` and `src/routes/gameRoutes.js`.
