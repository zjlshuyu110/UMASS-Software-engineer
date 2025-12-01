const User = require('../models/User');

// @route   GET /api/profile/check
// @desc    Check if user has a profile
exports.checkProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    // Check if profile exists (has age or sport_interests)
    const hasProfile = !!(user.age || (user.sport_interests && user.sport_interests.size > 0));
    
    res.json({ hasProfile });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// @route   POST /api/profile
// @desc    Create/set user profile
exports.createProfile = async (req, res) => {
  try {
    const { display_picture, name, age, sport_interests } = req.body;
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    // Check if profile already exists
    if (user.age || (user.sport_interests && user.sport_interests.size > 0)) {
      return res.status(400).json({ msg: 'Profile already exists. Use PUT to update.' });
    }
    
    // Validate required fields
    if (age === undefined || age === null) {
      return res.status(400).json({ msg: 'Age is required' });
    }
    
    // Update profile fields
    if (display_picture !== undefined) user.display_picture = display_picture;
    if (name !== undefined) user.name = name;
    user.age = age;
    
    // Convert sport_interests object to Map if provided
    if (sport_interests) {
      const sportMap = new Map();
      Object.keys(sport_interests).forEach(sport => {
        sportMap.set(sport, sport_interests[sport]);
      });
      user.sport_interests = sportMap;
    }
    
    await user.save();
    
    // Format response
    const profile = {
      display_picture: user.display_picture,
      name: user.name,
      email: user.email,
      age: user.age,
      sport_interests: user.sport_interests ? Object.fromEntries(user.sport_interests) : {}
    };
    
    res.status(201).json({ msg: 'Profile created successfully', profile });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// @route   GET /api/profile
// @desc    Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    // Format profile response
    const profile = {
      display_picture: user.display_picture,
      name: user.name,
      email: user.email,
      age: user.age,
      sport_interests: user.sport_interests ? Object.fromEntries(user.sport_interests) : {}
    };
    
    res.json({ profile });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// @route   PUT /api/profile
// @desc    Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { display_picture, name, age, sport_interests } = req.body;
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    // Update only provided fields
    if (display_picture !== undefined) user.display_picture = display_picture;
    if (name !== undefined) user.name = name;
    if (age !== undefined) user.age = age;
    
    // Update sport_interests if provided
    if (sport_interests !== undefined) {
      const sportMap = new Map();
      Object.keys(sport_interests).forEach(sport => {
        sportMap.set(sport, sport_interests[sport]);
      });
      user.sport_interests = sportMap;
    }
    
    await user.save();
    
    // Format response
    const profile = {
      display_picture: user.display_picture,
      name: user.name,
      email: user.email,
      age: user.age,
      sport_interests: user.sport_interests ? Object.fromEntries(user.sport_interests) : {}
    };
    
    res.json({ msg: 'Profile updated successfully', profile });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

