const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

router.post('/data', async (req, res) => {
  const { sensorId, venueId, type, value, unit, status } = req.body;
  
  try {
    const { data: sensor, error } = await supabase
      .from('sensors')
      .insert({
        sensor_id: sensorId,
        venue_id: venueId || null,
        type,
        value,
        unit,
        status: status || 'active'
      })
      .select()
      .single();
    
    if (error) {
      return res.status(500).json({ message: error.message });
    }
    
    if (type === 'occupancy' && venueId) {
      const { data: venue } = await supabase
        .from('venues')
        .select('capacity')
        .eq('id', venueId)
        .single();
      
      if (venue) {
        await supabase
          .from('venues')
          .update({ available_slots: venue.capacity - value })
          .eq('id', venueId);
      }
    }
    
    res.status(201).json({
      _id: sensor.id,
      sensorId: sensor.sensor_id,
      venueId: sensor.venue_id,
      type: sensor.type,
      value: sensor.value,
      unit: sensor.unit,
      timestamp: sensor.timestamp,
      status: sensor.status
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/data', async (req, res) => {
  const { sensorId, venueId, type, limit = 10 } = req.query;
  
  try {
    let query = supabase
      .from('sensors')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(parseInt(limit));
    
    if (sensorId) {
      query = query.eq('sensor_id', sensorId);
    }
    if (venueId) {
      query = query.eq('venue_id', venueId);
    }
    if (type) {
      query = query.eq('type', type);
    }
    
    const { data: sensors, error } = await query;
    
    if (error) {
      return res.status(500).json({ message: error.message });
    }
    
    const formattedSensors = sensors.map(sensor => ({
      _id: sensor.id,
      sensorId: sensor.sensor_id,
      venueId: sensor.venue_id,
      type: sensor.type,
      value: sensor.value,
      unit: sensor.unit,
      timestamp: sensor.timestamp,
      status: sensor.status
    }));
    
    res.json(formattedSensors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/venue/:venueId', async (req, res) => {
  try {
    const { data: sensors, error } = await supabase
      .from('sensors')
      .select('*')
      .eq('venue_id', req.params.venueId)
      .order('timestamp', { ascending: false })
      .limit(20);
    
    if (error) {
      return res.status(500).json({ message: error.message });
    }
    
    const formattedSensors = sensors.map(sensor => ({
      _id: sensor.id,
      sensorId: sensor.sensor_id,
      venueId: sensor.venue_id,
      type: sensor.type,
      value: sensor.value,
      unit: sensor.unit,
      timestamp: sensor.timestamp,
      status: sensor.status
    }));
    
    res.json(formattedSensors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/status/:sensorId', async (req, res) => {
  try {
    const { data: latestSensor, error } = await supabase
      .from('sensors')
      .select('*')
      .eq('sensor_id', req.params.sensorId)
      .order('timestamp', { ascending: false })
      .limit(1)
      .single();
    
    if (error || !latestSensor) {
      return res.status(404).json({ message: '传感器不存在' });
    }
    
    res.json({
      sensorId: latestSensor.sensor_id,
      type: latestSensor.type,
      value: latestSensor.value,
      unit: latestSensor.unit,
      timestamp: latestSensor.timestamp,
      status: latestSensor.status
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/status/:sensorId', async (req, res) => {
  try {
    const { data: latestSensor, error: findError } = await supabase
      .from('sensors')
      .select('*')
      .eq('sensor_id', req.params.sensorId)
      .order('timestamp', { ascending: false })
      .limit(1)
      .single();
    
    if (findError || !latestSensor) {
      return res.status(404).json({ message: '传感器不存在' });
    }
    
    const { data: updatedSensor, error } = await supabase
      .from('sensors')
      .update({ status: req.body.status })
      .eq('id', latestSensor.id)
      .select()
      .single();
    
    if (error) {
      return res.status(500).json({ message: error.message });
    }
    
    res.json({
      _id: updatedSensor.id,
      sensorId: updatedSensor.sensor_id,
      venueId: updatedSensor.venue_id,
      type: updatedSensor.type,
      value: updatedSensor.value,
      unit: updatedSensor.unit,
      timestamp: updatedSensor.timestamp,
      status: updatedSensor.status
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
