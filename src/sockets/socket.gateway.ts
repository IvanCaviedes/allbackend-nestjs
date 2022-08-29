import {
  OnGatewayDisconnect,
  OnGatewayInit,
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(81, { cors: { origin: '*' } })
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  afterInit(server: Server) {
    console.log('Se ejecuta al inicio');
  }
  handleConnection(client: Socket, ...args: any[]) {
    console.log('se ejecuta cuando se conecta alguien', client.id);
  }
  handleDisconnect(client: Socket) {
    console.log('Se ejecuta cuando se desconecta');
  }

  @SubscribeMessage('events')
  handleEvent(client: Socket, data: string): string {
    console.log(this.server.sockets.adapter.rooms);
    client.join('hola');
    return data;
  }
}
