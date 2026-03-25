import { io, Socket } from 'socket.io-client'

const SOCKET_URL = 'http://localhost:5000'

class SocketService {
  private socket: Socket | null = null
  
  connect(): Socket {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        transports: ['websocket']
      })
      
      this.socket.on('connect', () => {
        console.log('Socket connected:', this.socket?.id)
      })
      
      this.socket.on('disconnect', () => {
        console.log('Socket disconnected')
      })
    }
    return this.socket
  }
  
  joinActivity(activityId: string): void {
    if (this.socket) {
      this.socket.emit('join_activity', activityId)
    }
  }
  
  leaveActivity(activityId: string): void {
    if (this.socket) {
      this.socket.emit('leave_activity', activityId)
    }
  }
  
  sendMessage(activityId: string, message: string, userId: string, username: string): void {
    if (this.socket) {
      this.socket.emit('send_message', {
        activityId,
        message,
        userId,
        username,
        timestamp: new Date().toISOString()
      })
    }
  }
  
  onMessage(callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on('receive_message', callback)
    }
  }
  
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }
}

export default new SocketService()
