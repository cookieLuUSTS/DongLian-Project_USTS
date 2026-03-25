-- 动联运动社交平台数据库表结构
-- 在 Supabase SQL Editor 中执行此脚本

-- 启用 PostGIS 扩展（用于地理位置功能）
CREATE EXTENSION IF NOT EXISTS postgis;

-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) NOT NULL UNIQUE,
  phone VARCHAR(20) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  avatar VARCHAR(500) DEFAULT 'https://via.placeholder.com/150',
  bio TEXT DEFAULT '',
  sports TEXT[] DEFAULT '{}',
  level VARCHAR(20) DEFAULT 'beginner' CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  location GEOGRAPHY(POINT, 4326),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建用户地理位置索引
CREATE INDEX IF NOT EXISTS idx_users_location ON users USING GIST (location);

-- 场馆表
CREATE TABLE IF NOT EXISTS venues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  address VARCHAR(255) NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  location GEOGRAPHY(POINT, 4326),
  type VARCHAR(20) NOT NULL CHECK (type IN ('basketball', 'football', 'tennis', 'badminton', 'swimming', 'gym', 'other')),
  capacity INTEGER NOT NULL,
  available_slots INTEGER DEFAULT 0,
  facilities TEXT[] DEFAULT '{}',
  opening_hours VARCHAR(100) NOT NULL,
  contact VARCHAR(50) NOT NULL,
  rating DECIMAL(3, 2) DEFAULT 0,
  sensor_id VARCHAR(100) DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建场馆地理位置索引
CREATE INDEX IF NOT EXISTS idx_venues_location ON venues USING GIST (location);

-- 场馆评论表
CREATE TABLE IF NOT EXISTS venue_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 活动表
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  sport VARCHAR(20) NOT NULL CHECK (sport IN ('basketball', 'football', 'tennis', 'badminton', 'swimming', 'gym', 'other')),
  organizer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  venue_id UUID REFERENCES venues(id) ON DELETE SET NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  location_name VARCHAR(255) DEFAULT '',
  location GEOGRAPHY(POINT, 4326),
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  max_participants INTEGER NOT NULL,
  level VARCHAR(20) DEFAULT 'intermediate' CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建活动地理位置索引
CREATE INDEX IF NOT EXISTS idx_activities_location ON activities USING GIST (location);

-- 活动参与者表
CREATE TABLE IF NOT EXISTS activity_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(activity_id, user_id)
);

-- 传感器数据表
CREATE TABLE IF NOT EXISTS sensors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sensor_id VARCHAR(100) NOT NULL UNIQUE,
  venue_id UUID REFERENCES venues(id) ON DELETE SET NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('occupancy', 'temperature', 'humidity', 'light', 'noise')),
  value DECIMAL(10, 2) NOT NULL,
  unit VARCHAR(20) NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'error'))
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_venue_reviews_venue_id ON venue_reviews(venue_id);
CREATE INDEX IF NOT EXISTS idx_activity_participants_activity_id ON activity_participants(activity_id);
CREATE INDEX IF NOT EXISTS idx_activity_participants_user_id ON activity_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_sensors_venue_id ON sensors(venue_id);
CREATE INDEX IF NOT EXISTS idx_sensors_sensor_id ON sensors(sensor_id);
CREATE INDEX IF NOT EXISTS idx_sensors_timestamp ON sensors(timestamp);

-- 触发器：自动更新地理位置字段
CREATE OR REPLACE FUNCTION update_location()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
    NEW.location := ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326)::geography;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_location
  BEFORE INSERT OR UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_location();

CREATE TRIGGER update_venues_location
  BEFORE INSERT OR UPDATE ON venues
  FOR EACH ROW
  EXECUTE FUNCTION update_location();

CREATE TRIGGER update_activities_location
  BEFORE INSERT OR UPDATE ON activities
  FOR EACH ROW
  EXECUTE FUNCTION update_location();

-- 触发器：更新场馆评分
CREATE OR REPLACE FUNCTION update_venue_rating()
RETURNS TRIGGER AS $$
DECLARE
  avg_rating DECIMAL(3, 2);
BEGIN
  SELECT AVG(rating) INTO avg_rating
  FROM venue_reviews
  WHERE venue_id = NEW.venue_id;
  
  UPDATE venues SET rating = avg_rating WHERE id = NEW.venue_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_venue_rating_trigger
  AFTER INSERT OR UPDATE ON venue_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_venue_rating();

-- Row Level Security (RLS) 策略
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE sensors ENABLE ROW LEVEL SECURITY;

-- 公开读取策略
CREATE POLICY "公开读取用户信息" ON users FOR SELECT USING (true);
CREATE POLICY "公开读取场馆信息" ON venues FOR SELECT USING (true);
CREATE POLICY "公开读取场馆评论" ON venue_reviews FOR SELECT USING (true);
CREATE POLICY "公开读取活动信息" ON activities FOR SELECT USING (true);
CREATE POLICY "公开读取活动参与者" ON activity_participants FOR SELECT USING (true);
CREATE POLICY "公开读取传感器数据" ON sensors FOR SELECT USING (true);

-- 插入策略
CREATE POLICY "允许插入用户" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "允许插入场馆" ON venues FOR INSERT WITH CHECK (true);
CREATE POLICY "允许插入场馆评论" ON venue_reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "允许插入活动" ON activities FOR INSERT WITH CHECK (true);
CREATE POLICY "允许插入活动参与者" ON activity_participants FOR INSERT WITH CHECK (true);
CREATE POLICY "允许插入传感器数据" ON sensors FOR INSERT WITH CHECK (true);

-- 更新策略
CREATE POLICY "允许更新用户" ON users FOR UPDATE USING (true);
CREATE POLICY "允许更新场馆" ON venues FOR UPDATE USING (true);
CREATE POLICY "允许更新活动" ON activities FOR UPDATE USING (true);
CREATE POLICY "允许更新活动参与者" ON activity_participants FOR UPDATE USING (true);
CREATE POLICY "允许更新传感器数据" ON sensors FOR UPDATE USING (true);

-- RPC 函数：查找附近用户
CREATE OR REPLACE FUNCTION find_nearby_users(
  lat FLOAT,
  lng FLOAT,
  max_distance INTEGER DEFAULT 5000
)
RETURNS TABLE (
  id UUID,
  username VARCHAR(50),
  phone VARCHAR(20),
  avatar VARCHAR(500),
  bio TEXT,
  sports TEXT[],
  level VARCHAR(20),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.username,
    u.phone,
    u.avatar,
    u.bio,
    u.sports,
    u.level,
    u.latitude,
    u.longitude,
    u.created_at
  FROM users u
  WHERE u.location IS NOT NULL
    AND ST_DWithin(
      u.location,
      ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography,
      max_distance
    )
  ORDER BY ST_Distance(
    u.location,
    ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography
  );
END;
$$ LANGUAGE plpgsql;

-- RPC 函数：查找附近场馆
CREATE OR REPLACE FUNCTION find_nearby_venues(
  lat FLOAT,
  lng FLOAT,
  max_distance INTEGER DEFAULT 5000,
  filter_type VARCHAR(20) DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  name VARCHAR(100),
  address VARCHAR(255),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  type VARCHAR(20),
  capacity INTEGER,
  available_slots INTEGER,
  facilities TEXT[],
  opening_hours VARCHAR(100),
  contact VARCHAR(50),
  rating DECIMAL(3, 2),
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    v.id,
    v.name,
    v.address,
    v.latitude,
    v.longitude,
    v.type,
    v.capacity,
    v.available_slots,
    v.facilities,
    v.opening_hours,
    v.contact,
    v.rating,
    v.created_at
  FROM venues v
  WHERE v.location IS NOT NULL
    AND ST_DWithin(
      v.location,
      ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography,
      max_distance
    )
    AND (filter_type IS NULL OR v.type = filter_type)
  ORDER BY ST_Distance(
    v.location,
    ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography
  );
END;
$$ LANGUAGE plpgsql;

-- RPC 函数：查找附近活动
CREATE OR REPLACE FUNCTION find_nearby_activities(
  lat FLOAT,
  lng FLOAT,
  max_distance INTEGER DEFAULT 5000,
  filter_sport VARCHAR(20) DEFAULT NULL,
  filter_level VARCHAR(20) DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  title VARCHAR(100),
  description TEXT,
  sport VARCHAR(20),
  organizer_id UUID,
  organizer_username VARCHAR(50),
  organizer_avatar VARCHAR(500),
  venue_id UUID,
  venue_name VARCHAR(100),
  venue_address VARCHAR(255),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  max_participants INTEGER,
  level VARCHAR(20),
  status VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.id,
    a.title,
    a.description,
    a.sport,
    a.organizer_id,
    u.username,
    u.avatar,
    a.venue_id,
    v.name,
    v.address,
    a.latitude,
    a.longitude,
    a.start_time,
    a.end_time,
    a.max_participants,
    a.level,
    a.status,
    a.created_at
  FROM activities a
  LEFT JOIN users u ON a.organizer_id = u.id
  LEFT JOIN venues v ON a.venue_id = v.id
  WHERE a.location IS NOT NULL
    AND a.status = 'active'
    AND ST_DWithin(
      a.location,
      ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography,
      max_distance
    )
    AND (filter_sport IS NULL OR a.sport = filter_sport)
    AND (filter_level IS NULL OR a.level = filter_level)
  ORDER BY ST_Distance(
    a.location,
    ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography
  );
END;
$$ LANGUAGE plpgsql;

-- 消息表
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建消息索引
CREATE INDEX IF NOT EXISTS idx_messages_activity_id ON messages(activity_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);

-- 通知表
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  data JSONB,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建通知索引
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

-- 消息策略
CREATE POLICY "公开读取消息" ON messages FOR SELECT USING (true);
CREATE POLICY "允许插入消息" ON messages FOR INSERT WITH CHECK (true);

-- 通知策略
CREATE POLICY "公开读取通知" ON notifications FOR SELECT USING (true);
CREATE POLICY "允许插入通知" ON notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "允许更新通知" ON notifications FOR UPDATE USING (true);
