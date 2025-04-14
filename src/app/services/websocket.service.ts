import { Injectable, inject } from '@angular/core';
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({ providedIn: 'root' })
export class WebsocketService {
  private client!: Client;
  private isConnected = false;

  private auth = inject(AuthService);
  private route = inject(Router);

  constructor() {
    this.initializeClient();
  }

  private initializeClient() {
    this.client = new Client({
      brokerURL: 'ws://localhost:8080/syncdb/ws',
      connectHeaders: {
        Authorization: this.auth.getToken() ?? ''
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: (frame) => {
        console.log('[WebSocket conectado]', frame);
      },
      onStompError: (frame) => {
        console.error('[Erro STOMP]', frame);
        this.handleDisconnection();
      },
      onWebSocketError: (error) => {
        console.error('[Erro WebSocket]', error);
        this.handleDisconnection();
      },
    });
  }

  /**
   * Conecta ao servidor WebSocket usando Promise.
   * Aguarda até o WebSocket estar conectado com sucesso.
   */
  connect(): Promise<void> {
    if (this.isConnected) {
      return Promise.resolve();
    }

    return new Promise<void>((resolve, reject) => {
      this.client.onConnect = (frame) => {
        console.log('[WebSocket conectado]', frame);
        this.isConnected = true;
        resolve();
      };

      this.client.onStompError = (frame) => {
        console.error('[Erro STOMP]', frame);
        reject(frame);
      };

      this.client.onWebSocketError = (event) => {
        console.error('[Erro WebSocket]', event);
        this.handleDisconnection();
        reject(event);
      };

      // Atualiza token antes de ativar
      this.client.connectHeaders = {
        Authorization: this.auth.getToken() ?? ''
      };

      try {
        this.client.activate();
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Inscreve em um tópico WebSocket.
   */
  subscribe(topic: string, callback: (msg: any) => void): StompSubscription {
    return this.client.subscribe(topic, (message: IMessage) => {
      callback(JSON.parse(message.body));
    });
  }

  /**
   * Envia uma mensagem via WebSocket.
   */
  send(destination: string, body: any) {
    this.client.publish({
      destination,
      body: JSON.stringify(body)
    });
  }

  /**
   * Desconecta do WebSocket.
   */
  disconnect() {
    if (this.client && this.isConnected) {
      this.client.deactivate();
      this.isConnected = false;
    }
  }

  /**
   * Verifica se o WebSocket está conectado.
   */
  get connected(): boolean {
    return this.isConnected;
  }

 handleDisconnection() {
    console.log('[WebSocket desconectado]');
    this.auth.logout(); 
    // this.route.navigate(['/login']);
    Swal.fire({
                  icon: 'error',
                  title: 'Erro ao conectar WebSocket',
                  text: '[WebSocket desconectado] Não foi possível conectar ao WebSocket.',
                });
  }
}
