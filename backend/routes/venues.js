const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

router.post('/', async (req, res) => {
  const { name, address, location, type, capacity, facilities, openingHours, contact } = req.body;
  
  try {
    const { data: venue, error } = await supabase
      .from('venues')
      .insert({
        name,
        address,
        latitude: location?.coordinates?.[1] || 0,
        longitude: location?.coordinates?.[0] || 0,
        type,
        capacity,
        facilities: facilities || [],
        opening_hours: openingHours,
        contact
      })
      .select()
      .single();
    
    if (error) {
      return res.status(500).json({ message: error.message });
    }
    
    res.status(201).json({
      _id: venue.id,
      name: venue.name,
      address: venue.address,
      location: {
        type: 'Point',
        coordinates: [venue.longitude, venue.latitude]
      },
      type: venue.type,
      capacity: venue.capacity,
      availableSlots: venue.available_slots,
      facilities: venue.facilities,
      openingHours: venue.opening_hours,
      contact: venue.contact,
      rating: venue.rating,
      createdAt: venue.created_at
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { data: venues, error } = await supabase
      .from('venues')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      return res.status(500).json({ message: error.message });
    }
    
    const formattedVenues = venues.map(venue => ({
      _id: venue.id,
      name: venue.name,
      address: venue.address,
      location: {
        type: 'Point',
        coordinates: [venue.longitude, venue.latitude]
      },
      type: venue.type,
      capacity: venue.capacity,
      availableSlots: venue.available_slots,
      facilities: venue.facilities,
      openingHours: venue.opening_hours,
      contact: venue.contact,
      rating: venue.rating,
      sensorId: venue.sensor_id,
      createdAt: venue.created_at
    }));
    
    res.json(formattedVenues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { data: venue, error } = await supabase
      .from('venues')
      .select(`
        *,
        venue_reviews (
          id,
          user_id,
          rating,
          comment,
          created_at
        )
      `)
      .eq('id', req.params.id)
      .single();
    
    if (error || !venue) {
      return res.status(404).json({ message: '场地不存在' });
    }
    
    res.json({
      _id: venue.id,
      name: venue.name,
      address: venue.address,
      location: {
        type: 'Point',
        coordinates: [venue.longitude, venue.latitude]
      },
      type: venue.type,
      capacity: venue.capacity,
      availableSlots: venue.available_slots,
      facilities: venue.facilities,
      openingHours: venue.opening_hours,
      contact: venue.contact,
      rating: venue.rating,
      sensorId: venue.sensor_id,
      reviews: venue.venue_reviews?.map(review => ({
        _id: review.id,
        userId: review.user_id,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.created_at
      })) || [],
      createdAt: venue.created_at
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/nearby', async (req, res) => {
  const { lat, lng, distance = 5000, type } = req.query;
  
  try {
    const { data, error } = await supabase.rpc('find_nearby_venues', {
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      max_distance: parseInt(distance),
      filter_type: type || null
    });
    
    if (error) {
      let query = supabase
        .from('venues')
        .select('*')
        .not('latitude', 'is', null)
        .not('longitude', 'is', null);
      
      if (type) {
        query = query.eq('type', type);
      }
      
      const { data: venues, error: fallbackError } = await query;
      
      if (fallbackError) {
        return res.status(500).json({ message: fallbackError.message });
      }
      
      const formattedVenues = venues.map(venue => ({
        _id: venue.id,
        name: venue.name,
        address: venue.address,
        location: {
          type: 'Point',
          coordinates: [venue.longitude, venue.latitude]
        },
        type: venue.type,
        capacity: venue.capacity,
        availableSlots: venue.available_slots,
        facilities: venue.facilities,
        openingHours: venue.opening_hours,
        contact: venue.contact,
        rating: venue.rating,
        createdAt: venue.created_at
      }));
      
      return res.json(formattedVenues);
    }
    
    const formattedVenues = data.map(venue => ({
      _id: venue.id,
      name: venue.name,
      address: venue.address,
      location: {
        type: 'Point',
        coordinates: [venue.longitude, venue.latitude]
      },
      type: venue.type,
      capacity: venue.capacity,
      availableSlots: venue.available_slots,
      facilities: venue.facilities,
      openingHours: venue.opening_hours,
      contact: venue.contact,
      rating: venue.rating,
      createdAt: venue.created_at
    }));
    
    res.json(formattedVenues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updateData = {};
    
    if (req.body.name) updateData.name = req.body.name;
    if (req.body.address) updateData.address = req.body.address;
    if (req.body.location && req.body.location.coordinates) {
      updateData.longitude = req.body.location.coordinates[0];
      updateData.latitude = req.body.location.coordinates[1];
    }
    if (req.body.type) updateData.type = req.body.type;
    if (req.body.capacity) updateData.capacity = req.body.capacity;
    if (req.body.availableSlots !== undefined) updateData.available_slots = req.body.availableSlots;
    if (req.body.facilities) updateData.facilities = req.body.facilities;
    if (req.body.openingHours) updateData.opening_hours = req.body.openingHours;
    if (req.body.contact) updateData.contact = req.body.contact;
    
    const { data: venue, error } = await supabase
      .from('venues')
      .update(updateData)
      .eq('id', req.params.id)
      .select()
      .single();
    
    if (error || !venue) {
      return res.status(404).json({ message: '场地不存在' });
    }
    
    res.json({
      _id: venue.id,
      name: venue.name,
      address: venue.address,
      location: {
        type: 'Point',
        coordinates: [venue.longitude, venue.latitude]
      },
      type: venue.type,
      capacity: venue.capacity,
      availableSlots: venue.available_slots,
      facilities: venue.facilities,
      openingHours: venue.opening_hours,
      contact: venue.contact,
      rating: venue.rating,
      createdAt: venue.created_at
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/:id/review', async (req, res) => {
  try {
    const { userId, rating, comment } = req.body;
    
    const { data: review, error } = await supabase
      .from('venue_reviews')
      .insert({
        venue_id: req.params.id,
        user_id: userId,
        rating,
        comment
      })
      .select()
      .single();
    
    if (error) {
      return res.status(500).json({ message: error.message });
    }
    
    const { data: venue, error: venueError } = await supabase
      .from('venues')
      .select(`
        *,
        venue_reviews (
          id,
          user_id,
          rating,
          comment,
          created_at
        )
      `)
      .eq('id', req.params.id)
      .single();
    
    if (venueError) {
      return res.status(404).json({ message: '场地不存在' });
    }
    
    res.json({
      _id: venue.id,
      name: venue.name,
      address: venue.address,
      location: {
        type: 'Point',
        coordinates: [venue.longitude, venue.latitude]
      },
      type: venue.type,
      capacity: venue.capacity,
      availableSlots: venue.available_slots,
      facilities: venue.facilities,
      openingHours: venue.opening_hours,
      contact: venue.contact,
      rating: venue.rating,
      reviews: venue.venue_reviews?.map(r => ({
        _id: r.id,
        userId: r.user_id,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.created_at
      })) || [],
      createdAt: venue.created_at
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
