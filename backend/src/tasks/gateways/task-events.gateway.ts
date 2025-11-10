import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

export type TaskAssignmentNotification = {
  taskId: number;
  title: string;
  status?: string | null;
  isReassignment?: boolean;
};

@WebSocketGateway({
  namespace: 'tasks',
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class TaskEventsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(TaskEventsGateway.name);

  @WebSocketServer()
  server: Server;

  private readonly userSockets = new Map<number, Set<string>>();
  private readonly socketToUser = new Map<string, number>();

  handleConnection(socket: Socket) {
    const { userId } = socket.handshake.query;
    const numericUserId = Number(userId);

    if (!numericUserId || Number.isNaN(numericUserId)) {
      this.logger.warn(
        `Disconnecting socket ${socket.id}: missing or invalid userId`,
      );
      socket.disconnect(true);
      return;
    }

    const sockets = this.userSockets.get(numericUserId) ?? new Set<string>();
    sockets.add(socket.id);
    this.userSockets.set(numericUserId, sockets);
    this.socketToUser.set(socket.id, numericUserId);

    this.logger.debug(
      `User ${numericUserId} connected to task notifications (${socket.id})`,
    );
  }

  handleDisconnect(socket: Socket) {
    const userId = this.socketToUser.get(socket.id);
    if (userId === undefined) {
      return;
    }

    const sockets = this.userSockets.get(userId);
    if (sockets) {
      sockets.delete(socket.id);
      if (sockets.size === 0) {
        this.userSockets.delete(userId);
      }
    }

    this.socketToUser.delete(socket.id);
    this.logger.debug(
      `User ${userId} disconnected from task notifications (${socket.id})`,
    );
  }

  notifyAssignment(userId: number, payload: TaskAssignmentNotification): void {
    const sockets = this.userSockets.get(userId);
    if (!sockets?.size) {
      return;
    }

    sockets.forEach((socketId) => {
      this.server.to(socketId).emit('taskAssigned', payload);
    });
  }
}
