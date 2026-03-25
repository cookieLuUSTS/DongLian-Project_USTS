const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const supabase = require('./config/supabase');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('users').select('id').limit(1);
    if (error && error.code !== 'PGRST116') {
      console.error('Supabase 连接测试失败:', error.message);
    } else {
      console.log('Supabase 连接成功');
    }
  } catch (err) {
    console.error('Supabase 连接异常:', err.message);
  }
};

testConnection();

const userRoutes = require('./routes/users');
const venueRoutes = require('./routes/venues');
const activityRoutes = require('./routes/activities');
const sensorRoutes = require('./routes/sensors');
const messageRoutes = require('./routes/messages');

app.use('/api/users', userRoutes);
app.use('/api/venues', venueRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/sensors', sensorRoutes);
app.use('/api/messages', messageRoutes);

io.on('connection', (socket) => {
  console.log('用户连接:', socket.id);
  
  socket.on('join_activity', (activityId) => {
    socket.join(activityId);
    console.log(`用户加入活动: ${activityId}`);
  });
  
  socket.on('leave_activity', (activityId) => {
    socket.leave(activityId);
    console.log(`用户离开活动: ${activityId}`);
  });
  
  socket.on('send_message', (data) => {
    io.to(data.activityId).emit('receive_message', data);
  });
  
  socket.on('disconnect', () => {
    console.log('用户断开连接:', socket.id);
  });
});

app.get('/', (req, res) => {
  res.json({ message: '动联后端服务运行中 (Supabase)' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});

module.exports = { app, io };
