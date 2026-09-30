import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(AppGateway.name);

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinOrg')
  handleJoinOrg(client: Socket, payload: { organizationId: string }) {
    if (payload?.organizationId) {
      const room = `org_${payload.organizationId}`;
      client.join(room);
      this.logger.log(`Client ${client.id} joined room ${room}`);
      return { event: 'joinedRoom', data: room };
    }
  }

  emitToOrg(organizationId: string, event: string, data: any) {
    const room = `org_${organizationId}`;
    if (this.server) {
      this.server.to(room).emit(event, data);
    }
  }
}
