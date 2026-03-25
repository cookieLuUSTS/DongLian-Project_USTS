const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secretkey', {
    expiresIn: '30d'
  });
};

router.post('/register', async (req, res) => {
  const { username, phone, password, sports, level } = req.body;
  
  try {
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('phone', phone)
      .single();
    
    if (existingUser) {
      return res.status(400).json({ message: '用户已存在' });
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const { data: user, error } = await supabase
      .from('users')
      .insert({
        username,
        phone,
        password: hashedPassword,
        sports: sports || [],
        level: level || 'beginner'
      })
      .select()
      .single();
    
    if (error) {
      return res.status(500).json({ message: error.message });
    }
    
    res.status(201).json({
      _id: user.id,
      username: user.username,
      phone: user.phone,
      token: generateToken(user.id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { phone, password } = req.body;
  
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();
    
    if (error || !user) {
      return res.status(401).json({ message: '手机号或密码错误' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: '手机号或密码错误' });
    }
    
    res.json({
      _id: user.id,
      username: user.username,
      phone: user.phone,
      token: generateToken(user.id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/profile/:id', async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, username, phone, avatar, bio, sports, level, latitude, longitude, created_at')
      .eq('id', req.params.id)
      .single();
    
    if (error || !user) {
      return res.status(404).json({ message: '用户不存在' });
    }
    
    res.json({
      _id: user.id,
      username: user.username,
      phone: user.phone,
      avatar: user.avatar,
      bio: user.bio,
      sports: user.sports,
      level: user.level,
      location: user.latitude && user.longitude ? {
        type: 'Point',
        coordinates: [user.longitude, user.latitude]
      } : null,
      createdAt: user.created_at
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/profile/:id', async (req, res) => {
  try {
    const updateData = {};
    
    if (req.body.username) updateData.username = req.body.username;
    if (req.body.bio) updateData.bio = req.body.bio;
    if (req.body.sports) updateData.sports = req.body.sports;
    if (req.body.level) updateData.level = req.body.level;
    if (req.body.location && req.body.location.coordinates) {
      updateData.longitude = req.body.location.coordinates[0];
      updateData.latitude = req.body.location.coordinates[1];
    }
    
    const { data: user, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', req.params.id)
      .select()
      .single();
    
    if (error || !user) {
      return res.status(404).json({ message: '用户不存在' });
    }
    
    res.json({
      _id: user.id,
      username: user.username,
      phone: user.phone,
      avatar: user.avatar,
      bio: user.bio,
      sports: user.sports,
      level: user.level,
      location: user.latitude && user.longitude ? {
        type: 'Point',
        coordinates: [user.longitude, user.latitude]
      } : null,
      createdAt: user.created_at
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/nearby', async (req, res) => {
  const { lat, lng, distance = 5000 } = req.query;
  
  try {
    const { data, error } = await supabase.rpc('find_nearby_users', {
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      max_distance: parseInt(distance)
    });
    
    if (error) {
      const { data: users, error: fallbackError } = await supabase
        .from('users')
        .select('id, username, phone, avatar, bio, sports, level, latitude, longitude, created_at')
        .not('latitude', 'is', null)
        .not('longitude', 'is', null);
      
      if (fallbackError) {
        return res.status(500).json({ message: fallbackError.message });
      }
      
      const usersWithLocation = users.map(user => ({
        _id: user.id,
        username: user.username,
        phone: user.phone,
        avatar: user.avatar,
        bio: user.bio,
        sports: user.sports,
        level: user.level,
        location: {
          type: 'Point',
          coordinates: [user.longitude, user.latitude]
        },
        createdAt: user.created_at
      }));
      
      return res.json(usersWithLocation);
    }
    
    const usersWithLocation = data.map(user => ({
      _id: user.id,
      username: user.username,
      phone: user.phone,
      avatar: user.avatar,
      bio: user.bio,
      sports: user.sports,
      level: user.level,
      location: {
        type: 'Point',
        coordinates: [user.longitude, user.latitude]
      },
      createdAt: user.created_at
    }));
    
    res.json(usersWithLocation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
