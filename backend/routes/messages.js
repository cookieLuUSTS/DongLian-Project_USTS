const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

router.get('/notifications', async (req, res) => {
  const userId = req.query.userId;
  
  if (!userId) {
    return res.status(400).json({ message: '用户ID是必需的' });
  }
  
  try {
    const { data: notifications, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);
    
    if (error) {
      return res.status(500).json({ message: error.message });
    }
    
    res.json(notifications.map(n => ({
      _id: n.id,
      userId: n.user_id,
      type: n.type,
      title: n.title,
      content: n.content,
      data: n.data,
      isRead: n.is_read,
      createdAt: n.created_at
    })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/notifications/:id/read', async (req, res) => {
  try {
    const { data: notification, error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', req.params.id)
      .select()
      .single();
    
    if (error) {
      return res.status(500).json({ message: error.message });
    }
    
    res.json({
      _id: notification.id,
      isRead: notification.is_read
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/messages', async (req, res) => {
  const { activityId, userId, otherUserId } = req.query;
  
  if (!activityId || !userId || !otherUserId) {
    return res.status(400).json({ message: '缺少必要参数' });
  }
  
  try {
    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .eq('activity_id', activityId)
      .or([
        `and(sender_id.eq.${userId},receiver_id.eq.${otherUserId})`,
        `and(sender_id.eq.${otherUserId},receiver_id.eq.${userId})`
      ])
      .order('created_at', { ascending: true });
    
    if (error) {
      const { data: allMessages, error: fallbackError } = await supabase
        .from('messages')
        .select('*')
        .eq('activity_id', activityId)
        .order('created_at', { ascending: true });
      
      if (fallbackError) {
        return res.status(500).json({ message: fallbackError.message });
      }
      
      const filteredMessages = allMessages.filter(m => 
        (m.sender_id === userId && m.receiver_id === otherUserId) ||
        (m.sender_id === otherUserId && m.receiver_id === userId)
      );
      
      return res.json(filteredMessages.map(m => ({
        _id: m.id,
        activityId: m.activity_id,
        senderId: m.sender_id,
        receiverId: m.receiver_id,
        content: m.content,
        createdAt: m.created_at
      })));
    }
    
    res.json(messages.map(m => ({
      _id: m.id,
      activityId: m.activity_id,
      senderId: m.sender_id,
      receiverId: m.receiver_id,
      content: m.content,
      createdAt: m.created_at
    })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/messages', async (req, res) => {
  const { activityId, senderId, receiverId, content } = req.body;
  
  if (!activityId || !senderId || !receiverId || !content) {
    return res.status(400).json({ message: '缺少必要参数' });
  }
  
  try {
    const { data: message, error } = await supabase
      .from('messages')
      .insert({
        activity_id: activityId,
        sender_id: senderId,
        receiver_id: receiverId,
        content
      })
      .select()
      .single();
    
    if (error) {
      return res.status(500).json({ message: error.message });
    }
    
    res.status(201).json({
      _id: message.id,
      activityId: message.activity_id,
      senderId: message.sender_id,
      receiverId: message.receiver_id,
      content: message.content,
      createdAt: message.created_at
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/messages/conversations', async (req, res) => {
  const { userId, activityId } = req.query;
  
  if (!userId) {
    return res.status(400).json({ message: '用户ID是必需的' });
  }
  
  try {
    let query = supabase
      .from('messages')
      .select(`
        id,
        activity_id,
        sender_id,
        receiver_id,
        content,
        created_at,
        sender:users!messages_sender_id_fkey(id, username, avatar),
        receiver:users!messages_receiver_id_fkey(id, username, avatar)
      `)
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`);
    
    if (activityId) {
      query = query.eq('activity_id', activityId);
    }
    
    const { data: messages, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      return res.status(500).json({ message: error.message });
    }
    
    const conversations = [];
    const seenPairs = new Set();
    
    for (const msg of messages) {
      const otherUser = msg.sender_id === userId ? msg.receiver : msg.sender;
      const pairKey = `${userId}-${otherUser.id}`;
      
      if (!seenPairs.has(pairKey)) {
        seenPairs.add(pairKey);
        conversations.push({
          activityId: msg.activity_id,
          user: {
            _id: otherUser.id,
            username: otherUser.username,
            avatar: otherUser.avatar
          },
          lastMessage: msg.content,
          lastMessageTime: msg.created_at
        });
      }
    }
    
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
