const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

router.post('/', async (req, res) => {
  const { title, description, sport, organizer, venue, location, locationName, startTime, endTime, maxParticipants, level } = req.body;
  
  try {
    const { data: activity, error } = await supabase
      .from('activities')
      .insert({
        title,
        description,
        sport,
        organizer_id: organizer,
        venue_id: venue || null,
        latitude: location?.coordinates?.[1] || 0,
        longitude: location?.coordinates?.[0] || 0,
        location_name: locationName || '',
        start_time: startTime,
        end_time: endTime,
        max_participants: maxParticipants,
        level: level || 'intermediate'
      })
      .select()
      .single();
    
    if (error) {
      return res.status(500).json({ message: error.message });
    }
    
    res.status(201).json({
      _id: activity.id,
      title: activity.title,
      description: activity.description,
      sport: activity.sport,
      organizer: activity.organizer_id,
      venue: activity.venue_id,
      location: {
        type: 'Point',
        coordinates: [activity.longitude, activity.latitude]
      },
      locationName: activity.location_name,
      startTime: activity.start_time,
      endTime: activity.end_time,
      maxParticipants: activity.max_participants,
      level: activity.level,
      status: activity.status,
      createdAt: activity.created_at
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { data: activities, error } = await supabase
      .from('activities')
      .select(`
        *,
        users!activities_organizer_id_fkey (
          id,
          username,
          avatar
        ),
        venues (
          id,
          name,
          address
        ),
        activity_participants (
          id,
          user_id,
          status,
          joined_at,
          users (
            id,
            username,
            avatar
          )
        )
      `)
      .order('created_at', { ascending: false });
    
    if (error) {
      return res.status(500).json({ message: error.message });
    }
    
    const formattedActivities = activities.map(activity => ({
      _id: activity.id,
      title: activity.title,
      description: activity.description,
      sport: activity.sport,
      organizer: activity.users ? {
        _id: activity.users.id,
        username: activity.users.username,
        avatar: activity.users.avatar
      } : null,
      venue: activity.venues ? {
        _id: activity.venues.id,
        name: activity.venues.name,
        address: activity.venues.address
      } : null,
      location: {
        type: 'Point',
        coordinates: [activity.longitude, activity.latitude]
      },
      locationName: activity.location_name,
      startTime: activity.start_time,
      endTime: activity.end_time,
      maxParticipants: activity.max_participants,
      level: activity.level,
      status: activity.status,
      participants: activity.activity_participants?.map(p => ({
        _id: p.id,
        userId: p.user_id,
        status: p.status,
        joinedAt: p.joined_at,
        user: p.users ? {
          _id: p.users.id,
          username: p.users.username,
          avatar: p.users.avatar
        } : null
      })) || [],
      createdAt: activity.created_at
    }));
    
    res.json(formattedActivities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { data: activity, error } = await supabase
      .from('activities')
      .select(`
        *,
        users!activities_organizer_id_fkey (
          id,
          username,
          avatar,
          phone
        ),
        venues (
          id,
          name,
          address
        ),
        activity_participants (
          id,
          user_id,
          status,
          joined_at,
          users (
            id,
            username,
            avatar
          )
        )
      `)
      .eq('id', req.params.id)
      .single();
    
    if (error || !activity) {
      return res.status(404).json({ message: '活动不存在' });
    }
    
    res.json({
      _id: activity.id,
      title: activity.title,
      description: activity.description,
      sport: activity.sport,
      organizer: activity.users ? {
        _id: activity.users.id,
        username: activity.users.username,
        avatar: activity.users.avatar,
        phone: activity.users.phone
      } : null,
      venue: activity.venues ? {
        _id: activity.venues.id,
        name: activity.venues.name,
        address: activity.venues.address
      } : null,
      location: {
        type: 'Point',
        coordinates: [activity.longitude, activity.latitude]
      },
      locationName: activity.location_name,
      startTime: activity.start_time,
      endTime: activity.end_time,
      maxParticipants: activity.max_participants,
      level: activity.level,
      status: activity.status,
      participants: activity.activity_participants?.map(p => ({
        _id: p.id,
        userId: p.user_id,
        status: p.status,
        joinedAt: p.joined_at,
        user: p.users ? {
          _id: p.users.id,
          username: p.users.username,
          avatar: p.users.avatar
        } : null
      })) || [],
      createdAt: activity.created_at
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/nearby', async (req, res) => {
  const { lat, lng, distance = 5000, sport, level } = req.query;
  
  try {
    const { data, error } = await supabase.rpc('find_nearby_activities', {
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      max_distance: parseInt(distance),
      filter_sport: sport || null,
      filter_level: level || null
    });
    
    if (error) {
      let query = supabase
        .from('activities')
        .select(`
          *,
          users!activities_organizer_id_fkey (
            id,
            username,
            avatar
          ),
          venues (
            id,
            name,
            address
          ),
          activity_participants (
            id,
            user_id,
            status,
            joined_at,
            users (
              id,
              username,
              avatar
            )
          )
        `)
        .eq('status', 'active')
        .not('latitude', 'is', null)
        .not('longitude', 'is', null);
      
      if (sport) {
        query = query.eq('sport', sport);
      }
      
      if (level) {
        query = query.eq('level', level);
      }
      
      const { data: activities, error: fallbackError } = await query;
      
      if (fallbackError) {
        return res.status(500).json({ message: fallbackError.message });
      }
      
      const formattedActivities = activities.map(activity => ({
        _id: activity.id,
        title: activity.title,
        description: activity.description,
        sport: activity.sport,
        organizer: activity.users ? {
          _id: activity.users.id,
          username: activity.users.username,
          avatar: activity.users.avatar
        } : null,
        venue: activity.venues ? {
          _id: activity.venues.id,
          name: activity.venues.name,
          address: activity.venues.address
        } : null,
        location: {
          type: 'Point',
          coordinates: [activity.longitude, activity.latitude]
        },
        locationName: activity.location_name,
        startTime: activity.start_time,
        endTime: activity.end_time,
        maxParticipants: activity.max_participants,
        level: activity.level,
        status: activity.status,
        participants: activity.activity_participants?.map(p => ({
          _id: p.id,
          userId: p.user_id,
          status: p.status,
          joinedAt: p.joined_at,
          user: p.users ? {
            _id: p.users.id,
            username: p.users.username,
            avatar: p.users.avatar
          } : null
        })) || [],
        createdAt: activity.created_at
      }));
      
      return res.json(formattedActivities);
    }
    
    const formattedActivities = data.map(activity => ({
      _id: activity.id,
      title: activity.title,
      description: activity.description,
      sport: activity.sport,
      organizer: activity.organizer_id ? {
        _id: activity.organizer_id,
        username: activity.organizer_username,
        avatar: activity.organizer_avatar
      } : null,
      venue: activity.venue_id ? {
        _id: activity.venue_id,
        name: activity.venue_name,
        address: activity.venue_address
      } : null,
      location: {
        type: 'Point',
        coordinates: [activity.longitude, activity.latitude]
      },
      locationName: activity.location_name,
      startTime: activity.start_time,
      endTime: activity.end_time,
      maxParticipants: activity.max_participants,
      level: activity.level,
      status: activity.status,
      createdAt: activity.created_at
    }));
    
    res.json(formattedActivities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/:id/join', async (req, res) => {
  try {
    const { data: activity, error: activityError } = await supabase
      .from('activities')
      .select('id, max_participants')
      .eq('id', req.params.id)
      .single();
    
    if (activityError || !activity) {
      return res.status(404).json({ message: '活动不存在' });
    }
    
    const { data: existingParticipant } = await supabase
      .from('activity_participants')
      .select('id')
      .eq('activity_id', req.params.id)
      .eq('user_id', req.body.userId)
      .single();
    
    if (existingParticipant) {
      return res.status(400).json({ message: '已经加入该活动' });
    }
    
    const { count, error: countError } = await supabase
      .from('activity_participants')
      .select('id', { count: 'exact', head: true })
      .eq('activity_id', req.params.id)
      .eq('status', 'accepted');
    
    if (countError) {
      return res.status(500).json({ message: countError.message });
    }
    
    if (count >= activity.max_participants) {
      return res.status(400).json({ message: '活动人数已满' });
    }
    
    const { data: participant, error } = await supabase
      .from('activity_participants')
      .insert({
        activity_id: req.params.id,
        user_id: req.body.userId,
        status: 'pending'
      })
      .select()
      .single();
    
    if (error) {
      return res.status(500).json({ message: error.message });
    }
    
    const { data: updatedActivity, error: updatedError } = await supabase
      .from('activities')
      .select(`
        *,
        users!activities_organizer_id_fkey (
          id,
          username,
          avatar
        ),
        venues (
          id,
          name,
          address
        ),
        activity_participants (
          id,
          user_id,
          status,
          joined_at,
          users (
            id,
            username,
            avatar
          )
        )
      `)
      .eq('id', req.params.id)
      .single();
    
    if (updatedError) {
      return res.status(500).json({ message: updatedError.message });
    }
    
    res.json({
      _id: updatedActivity.id,
      title: updatedActivity.title,
      description: updatedActivity.description,
      sport: updatedActivity.sport,
      organizer: updatedActivity.users ? {
        _id: updatedActivity.users.id,
        username: updatedActivity.users.username,
        avatar: updatedActivity.users.avatar
      } : null,
      venue: updatedActivity.venues ? {
        _id: updatedActivity.venues.id,
        name: updatedActivity.venues.name,
        address: updatedActivity.venues.address
      } : null,
      location: {
        type: 'Point',
        coordinates: [updatedActivity.longitude, updatedActivity.latitude]
      },
      locationName: updatedActivity.location_name,
      startTime: updatedActivity.start_time,
      endTime: updatedActivity.end_time,
      maxParticipants: updatedActivity.max_participants,
      level: updatedActivity.level,
      status: updatedActivity.status,
      participants: updatedActivity.activity_participants?.map(p => ({
        _id: p.id,
        userId: p.user_id,
        status: p.status,
        joinedAt: p.joined_at,
        user: p.users ? {
          _id: p.users.id,
          username: p.users.username,
          avatar: p.users.avatar
        } : null
      })) || [],
      createdAt: updatedActivity.created_at
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/participants/:participantId', async (req, res) => {
  try {
    const { data: participant, error: participantError } = await supabase
      .from('activity_participants')
      .update({ status: req.body.status })
      .eq('id', req.params.participantId)
      .eq('activity_id', req.params.id)
      .select()
      .single();
    
    if (participantError || !participant) {
      return res.status(404).json({ message: '参与者不存在' });
    }
    
    const { data: updatedActivity, error: updatedError } = await supabase
      .from('activities')
      .select(`
        *,
        users!activities_organizer_id_fkey (
          id,
          username,
          avatar
        ),
        venues (
          id,
          name,
          address
        ),
        activity_participants (
          id,
          user_id,
          status,
          joined_at,
          users (
            id,
            username,
            avatar
          )
        )
      `)
      .eq('id', req.params.id)
      .single();
    
    if (updatedError) {
      return res.status(500).json({ message: updatedError.message });
    }
    
    res.json({
      _id: updatedActivity.id,
      title: updatedActivity.title,
      description: updatedActivity.description,
      sport: updatedActivity.sport,
      organizer: updatedActivity.users ? {
        _id: updatedActivity.users.id,
        username: updatedActivity.users.username,
        avatar: updatedActivity.users.avatar
      } : null,
      venue: updatedActivity.venues ? {
        _id: updatedActivity.venues.id,
        name: updatedActivity.venues.name,
        address: updatedActivity.venues.address
      } : null,
      location: {
        type: 'Point',
        coordinates: [updatedActivity.longitude, updatedActivity.latitude]
      },
      locationName: updatedActivity.location_name,
      startTime: updatedActivity.start_time,
      endTime: updatedActivity.end_time,
      maxParticipants: updatedActivity.max_participants,
      level: updatedActivity.level,
      status: updatedActivity.status,
      participants: updatedActivity.activity_participants?.map(p => ({
        _id: p.id,
        userId: p.user_id,
        status: p.status,
        joinedAt: p.joined_at,
        user: p.users ? {
          _id: p.users.id,
          username: p.users.username,
          avatar: p.users.avatar
        } : null
      })) || [],
      createdAt: updatedActivity.created_at
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updateData = {};
    
    if (req.body.title) updateData.title = req.body.title;
    if (req.body.description) updateData.description = req.body.description;
    if (req.body.sport) updateData.sport = req.body.sport;
    if (req.body.venue) updateData.venue_id = req.body.venue;
    if (req.body.location && req.body.location.coordinates) {
      updateData.longitude = req.body.location.coordinates[0];
      updateData.latitude = req.body.location.coordinates[1];
    }
    if (req.body.locationName !== undefined) updateData.location_name = req.body.locationName;
    if (req.body.startTime) updateData.start_time = req.body.startTime;
    if (req.body.endTime) updateData.end_time = req.body.endTime;
    if (req.body.maxParticipants) updateData.max_participants = req.body.maxParticipants;
    if (req.body.level) updateData.level = req.body.level;
    if (req.body.status) updateData.status = req.body.status;
    
    const { data: activity, error } = await supabase
      .from('activities')
      .update(updateData)
      .eq('id', req.params.id)
      .select()
      .single();
    
    if (error || !activity) {
      return res.status(404).json({ message: '活动不存在' });
    }
    
    res.json({
      _id: activity.id,
      title: activity.title,
      description: activity.description,
      sport: activity.sport,
      organizer: activity.organizer_id,
      venue: activity.venue_id,
      location: {
        type: 'Point',
        coordinates: [activity.longitude, activity.latitude]
      },
      locationName: activity.location_name,
      startTime: activity.start_time,
      endTime: activity.end_time,
      maxParticipants: activity.max_participants,
      level: activity.level,
      status: activity.status,
      createdAt: activity.created_at
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { data: activity, error: findError } = await supabase
      .from('activities')
      .select('id')
      .eq('id', req.params.id)
      .single();
    
    if (findError || !activity) {
      return res.status(404).json({ message: '活动不存在' });
    }
    
    await supabase
      .from('activity_participants')
      .delete()
      .eq('activity_id', req.params.id);
    
    const { error } = await supabase
      .from('activities')
      .delete()
      .eq('id', req.params.id);
    
    if (error) {
      return res.status(500).json({ message: error.message });
    }
    
    res.json({ message: '活动已删除' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
