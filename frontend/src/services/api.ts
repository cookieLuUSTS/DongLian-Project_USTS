import axios from 'axios'

const API_URL = '/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 用户相关API
export const userApi = {
  register: (data: any) => api.post('/users/register', data),
  login: (data: any) => api.post('/users/login', data),
  getProfile: (id: string) => api.get(`/users/profile/${id}`),
  updateProfile: (id: string, data: any) => api.put(`/users/profile/${id}`, data),
  getNearbyUsers: (params: any) => api.get('/users/nearby', { params })
}

// 场地相关API
export const venueApi = {
  getAll: () => api.get('/venues'),
  getById: (id: string) => api.get(`/venues/${id}`),
  getNearby: (params: any) => api.get('/venues/nearby', { params }),
  create: (data: any) => api.post('/venues', data),
  update: (id: string, data: any) => api.put(`/venues/${id}`, data),
  addReview: (id: string, data: any) => api.post(`/venues/${id}/review`, data)
}

// 活动相关API
export const activityApi = {
  getAll: () => api.get('/activities'),
  getById: (id: string) => api.get(`/activities/${id}`),
  getNearby: (params: any) => api.get('/activities/nearby', { params }),
  create: (data: any) => api.post('/activities', data),
  update: (id: string, data: any) => api.put(`/activities/${id}`, data),
  delete: (id: string) => api.delete(`/activities/${id}`),
  join: (id: string, data: any) => api.post(`/activities/${id}/join`, data),
  updateParticipant: (id: string, participantId: string, data: any) => api.put(`/activities/${id}/participants/${participantId}`, data)
}

// 传感器相关API
export const sensorApi = {
  uploadData: (data: any) => api.post('/sensors/data', data),
  getSensorData: (params: any) => api.get('/sensors/data', { params }),
  getVenueSensors: (venueId: string) => api.get(`/sensors/venue/${venueId}`),
  getSensorStatus: (sensorId: string) => api.get(`/sensors/status/${sensorId}`),
  updateSensorStatus: (sensorId: string, data: any) => api.put(`/sensors/status/${sensorId}`, data)
}

// 通知相关API
export const notificationApi = {
  getNotifications: (userId: string) => api.get('/messages/notifications', { params: { userId } }),
  markAsRead: (id: string) => api.put(`/messages/notifications/${id}/read`)
}

// 消息相关API
export const messageApi = {
  getMessages: (activityId: string, userId: string, otherUserId: string) => 
    api.get('/messages/messages', { params: { activityId, userId, otherUserId } }),
  sendMessage: (data: any) => api.post('/messages/messages', data),
  getConversations: (userId: string, activityId?: string) => 
    api.get('/messages/messages/conversations', { params: { userId, activityId } })
}

export default api
