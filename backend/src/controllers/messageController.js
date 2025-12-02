const Message = require('../models/Message');
const User = require('../models/User');

// @route   POST /api/messages/send
// @desc    Send a message to another user
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, content, messageType, relatedGame } = req.body;
    const senderId = req.user.id;

    // Validate receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ msg: 'Receiver not found' });
    }

    // Create message
    const message = new Message({
      sender: senderId,
      receiver: receiverId,
      content,
      messageType: messageType || 'text',
      relatedGame: relatedGame || null
    });

    await message.save();

    // Populate sender info
    await message.populate('sender', 'name email');
    await message.populate('receiver', 'name email');

    res.status(201).json({ msg: 'Message sent', message });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// @route   GET /api/messages/conversations
// @desc    Get all conversations for the logged-in user
exports.getConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all messages where user is sender or receiver
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }]
    })
      .populate('sender', 'name email display_picture')
      .populate('receiver', 'name email display_picture')
      .sort({ createdAt: -1 });

    // Group messages by conversation partner
    const conversationsMap = new Map();

    messages.forEach(message => {
      const partnerId = message.sender._id.toString() === userId 
        ? message.receiver._id.toString() 
        : message.sender._id.toString();
      
      const partner = message.sender._id.toString() === userId 
        ? message.receiver 
        : message.sender;

      if (!conversationsMap.has(partnerId)) {
        conversationsMap.set(partnerId, {
          partner: {
            _id: partner._id,
            name: partner.name,
            email: partner.email,
            display_picture: partner.display_picture
          },
          lastMessage: message,
          unreadCount: 0,
          messages: []
        });
      }

      const conversation = conversationsMap.get(partnerId);
      conversation.messages.push(message);

      // Count unread messages
      if (message.receiver._id.toString() === userId && !message.isRead) {
        conversation.unreadCount++;
      }
    });

    // Convert map to array
    const conversations = Array.from(conversationsMap.values());

    res.json({ conversations });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// @route   GET /api/messages/conversation/:userId
// @desc    Get messages with a specific user
exports.getConversationWithUser = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const otherUserId = req.params.userId;

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: otherUserId },
        { sender: otherUserId, receiver: currentUserId }
      ]
    })
      .populate('sender', 'name email display_picture')
      .populate('receiver', 'name email display_picture')
      .sort({ createdAt: 1 });

    // Mark messages as read
    await Message.updateMany(
      { sender: otherUserId, receiver: currentUserId, isRead: false },
      { isRead: true }
    );

    res.json({ messages });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// @route   GET /api/messages/unread-count
// @desc    Get count of unread messages
exports.getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;

    const unreadCount = await Message.countDocuments({
      receiver: userId,
      isRead: false
    });

    res.json({ unreadCount });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// @route   PUT /api/messages/mark-read/:messageId
// @desc    Mark a message as read
exports.markAsRead = async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);

    if (!message) {
      return res.status(404).json({ msg: 'Message not found' });
    }

    if (message.receiver.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    message.isRead = true;
    await message.save();

    res.json({ msg: 'Message marked as read', message });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
