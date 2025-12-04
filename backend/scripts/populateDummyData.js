const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../src/models/User');
const Game = require('../src/models/Game');
const Notification = require('../src/models/Notif');
const connectDB = require('../src/config/db');

// Sample data
const firstNames = ['John', 'Jane', 'Mike', 'Sarah', 'David', 'Emily', 'Chris', 'Jessica', 'Alex', 'Maria', 'Tom', 'Lisa', 'Ryan', 'Amy', 'Kevin', 'Rachel', 'Daniel', 'Michelle', 'James', 'Nicole'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee'];
const locations = [
  'Boyden Gymnasium',
  'Curry Hicks Cage',
  'Mullins Center',
  'McGuirk Alumni Stadium',
  'Garber Field',
  'Isenberg Fields',
  'Rudd Field',
  'Sortino Field',
  'Warren P. McGuirk Alumni Stadium',
  'Campus Recreation Center'
];

const SPORTS = [
  'Soccer', 'Basketball', 'Baseball', 'Football', 'Tennis', 'Volleyball', 'Cricket', 'Hockey', 'Rugby',
  'Table Tennis', 'Badminton', 'Golf', 'Softball', 'Lacrosse', 'Ultimate Frisbee', 'Track', 'Swimming',
  'Wrestling', 'Rowing', 'Field Hockey', 'Other'
];

// Generate random email
function generateRandomEmail() {
  const randomNum = Math.floor(Math.random() * 10000);
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)].toLowerCase();
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)].toLowerCase();
  return `${firstName}.${lastName}${randomNum}@umass.edu`;
}

// Generate random name
function generateRandomName() {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${firstName} ${lastName}`;
}

// Generate random sport interests
function generateSportInterests() {
  const interests = new Map();
  const numSports = Math.floor(Math.random() * 5) + 2; // 2-6 sports
  const selectedSports = SPORTS.sort(() => 0.5 - Math.random()).slice(0, numSports);
  
  selectedSports.forEach(sport => {
    interests.set(sport, Math.floor(Math.random() * 5) + 1); // Skill level 1-5
  });
  
  return interests;
}

// Generate random date in next 24 hours
function generateDateInNext24Hours() {
  const now = new Date();
  const hoursToAdd = Math.random() * 24;
  return new Date(now.getTime() + hoursToAdd * 60 * 60 * 1000);
}

async function populateDummyData() {
  try {
    // Connect to database
    await connectDB();
    console.log('Connected to database');

    // Clear existing data (optional - comment out if you want to keep existing data)
    // await User.deleteMany({});
    // await Game.deleteMany({});
    // await Notification.deleteMany({});
    // console.log('Cleared existing data');

    // Create dummy users
    const password = 'difficult';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const users = [];
    const numUsers = 20; // Create 20 dummy users

    console.log('Creating dummy users...');
    for (let i = 0; i < numUsers; i++) {
      let email;
      let user;
      let attempts = 0;
      
      // Try to create user with unique email
      do {
        email = generateRandomEmail();
        user = await User.findOne({ email });
        attempts++;
        if (attempts > 10) {
          console.log(`Skipping user ${i + 1} - couldn't generate unique email`);
          break;
        }
      } while (user);

      if (attempts > 10) continue;

      const name = generateRandomName();
      const age = Math.floor(Math.random() * 20) + 18; // Age 18-37
      const sport_interests = generateSportInterests();

      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        isVerified: true, // Set as verified so they can login
        age,
        sport_interests
      });

      await newUser.save();
      users.push(newUser);
      console.log(`Created user ${i + 1}/${numUsers}: ${name} (${email})`);
    }

    console.log(`\nCreated ${users.length} users\n`);

    // Create games with at least 5 in the next 24 hours
    const games = [];
    const numGames = 10; // Create 10 games total
    const gamesInNext24Hours = 5; // At least 5 in next 24 hours

    console.log('Creating dummy games...');
    
    // First, create games in the next 24 hours
    for (let i = 0; i < gamesInNext24Hours; i++) {
      const creator = users[Math.floor(Math.random() * users.length)];
      const sportType = SPORTS[Math.floor(Math.random() * SPORTS.length)];
      const startAt = generateDateInNext24Hours();
      const maxPlayers = Math.floor(Math.random() * 8) + 6; // 6-13 players
      const location = locations[Math.floor(Math.random() * locations.length)];
      const name = `${sportType} Game at ${location}`;

      // Select some users to invite (2-4 invites)
      const numInvites = Math.floor(Math.random() * 3) + 2;
      const inviteEmails = [];
      const availableUsers = users.filter(u => u._id.toString() !== creator._id.toString());
      const shuffled = availableUsers.sort(() => 0.5 - Math.random());
      
      for (let j = 0; j < Math.min(numInvites, shuffled.length); j++) {
        inviteEmails.push(shuffled[j].email);
      }

      const game = new Game({
        name,
        sportType,
        creator: creator._id,
        players: [creator._id], // Creator is automatically a player
        invitations: inviteEmails.map(email => ({ email, status: 'pending' })),
        requests: [],
        maxPlayers,
        location,
        startAt,
        status: 'open'
      });

      await game.save();
      games.push(game);
      console.log(`Created game ${i + 1}/${gamesInNext24Hours} (next 24h): ${name}`);

      // Create notifications for invited users
      for (const email of inviteEmails) {
        const invitedUser = users.find(u => u.email === email);
        if (invitedUser) {
          const notification = new Notification({
            user: invitedUser._id,
            game: game._id,
            category: 'invitation',
            type: 'join',
            title: `${creator.name} has invited you to join the game`,
            date: new Date(),
            unread: true
          });
          await notification.save();
        }
      }
    }

    // Create remaining games (can be in future beyond 24 hours)
    for (let i = gamesInNext24Hours; i < numGames; i++) {
      const creator = users[Math.floor(Math.random() * users.length)];
      const sportType = SPORTS[Math.floor(Math.random() * SPORTS.length)];
      // Random date in next 7 days
      const daysFromNow = Math.random() * 7;
      const startAt = new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000);
      const maxPlayers = Math.floor(Math.random() * 8) + 6;
      const location = locations[Math.floor(Math.random() * locations.length)];
      const name = `${sportType} Game at ${location}`;

      // Select some users to invite
      const numInvites = Math.floor(Math.random() * 3) + 1;
      const inviteEmails = [];
      const availableUsers = users.filter(u => u._id.toString() !== creator._id.toString());
      const shuffled = availableUsers.sort(() => 0.5 - Math.random());
      
      for (let j = 0; j < Math.min(numInvites, shuffled.length); j++) {
        inviteEmails.push(shuffled[j].email);
      }

      const game = new Game({
        name,
        sportType,
        creator: creator._id,
        players: [creator._id],
        invitations: inviteEmails.map(email => ({ email, status: 'pending' })),
        requests: [],
        maxPlayers,
        location,
        startAt,
        status: 'open'
      });

      await game.save();
      games.push(game);
      console.log(`Created game ${i + 1}/${numGames}: ${name}`);

      // Create notifications for invited users
      for (const email of inviteEmails) {
        const invitedUser = users.find(u => u.email === email);
        if (invitedUser) {
          const notification = new Notification({
            user: invitedUser._id,
            game: game._id,
            category: 'invitation',
            type: 'join',
            title: `${creator.name} has invited you to join the game`,
            date: new Date(),
            unread: true
          });
          await notification.save();
        }
      }
    }

    console.log(`\nCreated ${games.length} games\n`);

    // Add requests to games
    console.log('Adding requests to games...');
    let requestCount = 0;
    
    for (const game of games) {
      // Add 1-3 requests per game
      const numRequests = Math.floor(Math.random() * 3) + 1;
      const availableUsers = users.filter(u => {
        // User should not be creator, not already a player, and not already invited
        const isCreator = u._id.toString() === game.creator.toString();
        const isPlayer = game.players.some(p => p.toString() === u._id.toString());
        const isInvited = game.invitations.some(inv => inv.email === u.email);
        return !isCreator && !isPlayer && !isInvited;
      });

      const shuffled = availableUsers.sort(() => 0.5 - Math.random());
      const requestUsers = shuffled.slice(0, Math.min(numRequests, shuffled.length));

      for (const user of requestUsers) {
        game.requests.push({
          email: user.email,
          status: 'pending',
          requestedAt: new Date()
        });
        requestCount++;

        // Create notification for game creator
        const notification = new Notification({
          user: game.creator,
          game: game._id,
          category: 'request',
          type: 'join',
          title: `${user.name} has requested to join the game`,
          date: new Date(),
          unread: true
        });
        await notification.save();
      }

      await game.save();
    }

    console.log(`Added ${requestCount} requests to games\n`);

    // Add some players who accepted invites (optional - to make data more realistic)
    console.log('Simulating some accepted invites...');
    let acceptedInvites = 0;
    
    for (const game of games) {
      // Randomly accept some invites (30-50% of pending invites)
      const pendingInvites = game.invitations.filter(inv => inv.status === 'pending');
      const numToAccept = Math.floor(pendingInvites.length * (0.3 + Math.random() * 0.2));
      
      for (let i = 0; i < Math.min(numToAccept, pendingInvites.length); i++) {
        const invite = pendingInvites[i];
        const invitedUser = users.find(u => u.email === invite.email);
        
        if (invitedUser && game.players.length < game.maxPlayers) {
          invite.status = 'accepted';
          game.players.push(invitedUser._id);
          acceptedInvites++;

          // Create notification for creator
          const notification = new Notification({
            user: game.creator,
            game: game._id,
            category: 'invitation',
            type: 'accept',
            title: `${invitedUser.name} has accepted your invitation to join the game`,
            date: new Date(),
            unread: true
          });
          await notification.save();
        }
      }

      await game.save();
    }

    console.log(`Accepted ${acceptedInvites} invites\n`);

    // Summary
    console.log('='.repeat(50));
    console.log('POPULATION SUMMARY');
    console.log('='.repeat(50));
    console.log(`Users created: ${users.length}`);
    console.log(`Games created: ${games.length}`);
    console.log(`Games in next 24 hours: ${gamesInNext24Hours}`);
    console.log(`Requests added: ${requestCount}`);
    console.log(`Invites accepted: ${acceptedInvites}`);
    
    const totalNotifications = await Notification.countDocuments();
    console.log(`Total notifications: ${totalNotifications}`);
    console.log('='.repeat(50));
    console.log('\nAll users have password: "difficult"');
    console.log('All users are verified and ready to login');
    console.log('\nDone!');

    // Close database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);

  } catch (error) {
    console.error('Error populating dummy data:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Run the script
populateDummyData();

