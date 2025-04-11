import { inject, Inject, Injectable } from '@angular/core';
import { Client, StompSubscription } from '@stomp/stompjs';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class WebsocketService {
  private client: Client;

  auth = inject(AuthService);
  constructor() {

    const token = this.auth.getToken();

    this.client = new Client({
      brokerURL: 'ws://localhost:8080/syncdb/ws', 
      connectHeaders: {
        Authorization: `${token}`
      },
      debug: (msg) => console.log('[STOMP DEBUG]', msg),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });
  }

  connect(callback?: () => void) {
    this.client.onConnect = (frame) => {
      console.log('[WebSocket conectado]', frame);
      if (callback) callback();
    };

    this.client.onStompError = (frame) => {
      console.error('[Erro STOMP]', frame);
    };

    this.client.activate();
  }

  subscribe(topic: string, callback: (msg: any) => void): StompSubscription {
    return this.client.subscribe(topic, (message) => {
      callback(JSON.parse(message.body));
    });
  }

  send(destination: string, body: any) {
    this.client.publish({
      destination,
      body: JSON.stringify(body)
    });
  }

  disconnect() {
    this.client.deactivate();
  }
}
