import { Injectable, inject } from '@angular/core';
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { BehaviorSubject, Subject } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class WebsocketService {
  private client!: Client;
  private isConnected = false;
  private readonly API = `${environment.apiUrlWebSocket}`;

  private auth = inject(AuthService);
  private route = inject(Router);

  private pingInterval: any = null;
  private pongTimeout: any = null;
  private readonly pongTimeoutMs = 4000;

  private progressoSubject = new Subject<number>();
  progresso$ = this.progressoSubject.asObservable();

  // Indica se há progresso (ex: progresso entre 1 e 99)
  private emProgressoSubject = new BehaviorSubject<boolean>(false);
  emProgresso$ = this.emProgressoSubject.asObservable();

  private reconnectionAttempts = 0;
  private readonly maxReconnectionAttempts = 5;

  constructor() {
    this.initializeClient();
  }

  private initializeClient() {
    this.client = new Client({
      brokerURL: `ws://${this.API}/ws`,
      // brokerURL: 'ws://localhost:8080/syncdb/ws',
      // ws://syncdb-mfa3.onrender.com/syncdb/ws

      connectHeaders: {
        Authorization: this.auth.getToken() ?? '',
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.client.onConnect = (frame) => {
      console.log('[WebSocket conectado]', frame);
      this.isConnected = true;
      this.reconnectionAttempts = 0;
      this.startPing();
      this.subscribeToPong();
      this.subscribeProgress();
    };

    this.client.onDisconnect = () => {
      console.log('[WebSocket desconectado]');
      this.desconectarWebSocket();
    };

    this.client.onWebSocketClose = (event) => {
      console.warn('[WebSocket fechadoo]', event.reason || event);
      this.reconectWebSocket();
    };

    this.client.onStompError = (frame) => {
      console.error('[Erro STOMP]', frame);
      this.reconectWebSocket();
    };

    this.client.onWebSocketError = (error) => {
      console.error('[Erro WebSocket]', error);
      this.desconectarWebSocket();
    };
  }

  connect(): Promise<void> {
    if (this.isConnected) {
      return Promise.resolve();
    }

    this.client.connectHeaders = {
      Authorization: this.auth.getToken() ?? '',
    };

    return new Promise<void>((resolve, reject) => {
      this.client.onConnect = (frame) => {
        console.log('[WebSocket conectado]', frame);
        this.isConnected = true;
        this.reconnectionAttempts = 0;
        this.startPing();
        this.subscribeToPong();
        this.subscribeProgress();
        resolve();
      };

      this.client.activate();
    });
  }

  subscribe(topic: string, callback: (msg: any) => void): StompSubscription {
    return this.client.subscribe(topic, (message: IMessage) => {
      callback(JSON.parse(message.body));
    });
  }

  send(destination: string, body: any) {
    if (!this.connected) {
      console.warn('WebSocket não está conectado. Ignorando envio.');
      return;
    }

    this.client.publish({
      destination,
      body: JSON.stringify(body),
    });
  }

  disconnect() {
    if (this.client && this.isConnected) {
      this.client.deactivate().then(() => {
        this.isConnected = false;
      });

      if (this.pingInterval) {
        clearInterval(this.pingInterval);
        this.pingInterval = null;
      }

      if (this.pongTimeout) {
        clearTimeout(this.pongTimeout);
        this.pongTimeout = null;
      }
    }
  }

  get connected(): boolean {
    return this.isConnected;
  }

  getConnected(): boolean {
    return this.isConnected;
  }

  desconectarWebSocket() {
    this.disconnect();
    this.auth.logout();
    Swal.fire({
      icon: 'error',
      title: 'Erro ao conectar WebSocket',
      text: '[WebSocket desconectado] Não foi possível conectar ao WebSocket.',
    });
    this.isConnected = false;
  }

  reconectWebSocket() {
    if (this.reconnectionAttempts < this.maxReconnectionAttempts) {
      this.reconnectionAttempts++;
      console.log(
        `Tentando reconectar... tentativa ${this.reconnectionAttempts}`
      );
      setTimeout(() => {
        this.connect().catch(() => {
          console.error('Erro ao tentar reconectar WebSocket');
        });
      }, 3000); // espera 3 segundos para tentar de novo
    } else {
      console.error(
        'Máximo de tentativas de reconexão alcançado. Desconectando.'
      );
      this.desconectarWebSocket();
      this.isConnected = false;
    }
  }

  startPing(intervalMs: number = 5000) {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
    }

    this.pingInterval = setInterval(() => {
      if (this.connected) {
        this.send('/app/ping', { mensagem: 'ping' });

        if (this.pongTimeout) {
          clearTimeout(this.pongTimeout);
        }

        this.pongTimeout = setTimeout(() => {
          console.warn('Pong não recebido dentro do tempo limite!');
          this.desconectarWebSocket();
        }, this.pongTimeoutMs);
      }
    }, intervalMs);
  }

  subscribeToPong() {
    this.subscribe('/topic/pong', (msg) => {
      if (this.pongTimeout) {
        clearTimeout(this.pongTimeout);
        this.pongTimeout = null;
      }
    });
  }

  subscribeProgress() {
    this.subscribe('/topic/sync/progress', (data) => {
      if (this.pongTimeout) {
        clearTimeout(this.pongTimeout);
        this.pongTimeout = null;
      }

      const progresso = Number(data?.progresso ?? 0);
      this.progressoSubject.next(progresso);

      const emAndamento = progresso > 0 && progresso < 100;
      this.emProgressoSubject.next(emAndamento);
    });
  }
}
