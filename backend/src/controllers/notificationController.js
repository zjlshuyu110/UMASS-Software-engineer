const Notification = require('../models/Notif');

exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await Notification.find({ user: userId })
      .populate('game')
      .sort({ createdAt: -1 });
    
    res.json({ notifications });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({ msg: 'Notification not found' });
    }
    
    // Verify the notification belongs to the authenticated user
    if (notification.user.toString() !== userId) {
      return res.status(403).json({ msg: 'Not authorized to update this notification' });
    }
    
    notification.unread = false;
    await notification.save();
    
    res.json({ msg: 'Notification marked as read', notification });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

