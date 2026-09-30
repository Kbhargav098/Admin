import { io, Socket } from 'socket.io-client';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3000';

class SocketClient {
  private socket: Socket | null = null;

  connect() {
    if (!this.socket) {
      this.socket = io(WS_URL, {
        transports: ['websocket', 'polling'],
        autoConnect: true,
      });
    }
    return this.socket;
  }

  joinOrg(organizationId: string) {
    if (this.socket) {
      this.socket.emit('joinOrg', { organizationId });
    }
  }

  onApplicationStatusUpdated(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('applicationStatusUpdated', callback);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketClient = new SocketClient();
