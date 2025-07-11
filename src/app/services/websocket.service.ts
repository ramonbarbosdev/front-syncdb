import { Injectable, inject } from '@angular/core';
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { BehaviorSubject, Subject } from 'rxjs';
import { environment } from '../environments/environment';
import SockJS from 'sockjs-client';

@Injectable({ providedIn: 'root' })
export class WebsocketService {
  private isConnected = false;
  private readonly API = `${environment.apiUrlWebSocket}`;
  private stompClient!: Client;
  private auth = inject(AuthService);
  private route = inject(Router);

  private pingInterval: any = null;
  private pongTimeout: any = null;
  private readonly pongTimeoutMs = 4000;

  private progressoSubject = new Subject<number>();
  progresso$ = this.progressoSubject.asObservable();

  private emProgressoSubject = new BehaviorSubject<boolean>(false);
  emProgresso$ = this.emProgressoSubject.asObservable();

  private reconnectionAttempts = 0;
  private readonly maxReconnectionAttempts = 5;

  constructor() {
    this.initConnectionSocket();
  }

  private initConnectionSocket() {
    const url = `${environment.apiUrlWebSocket}`;
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(url),
      reconnectDelay: 5000,
      debug: (str) => console.log(),
      onConnect: () => {
        this.isConnected = true;
        console.log('Conectado ao WebSocket');

        // ⚠️ Aqui você pode chamar a subscription
        this.subscribeProgress();
      },
      onStompError: (frame) => {
        this.isConnected = false;
        console.error('Erro STOMP:', frame);
      },
      onWebSocketClose: () => {
        this.isConnected = false;
        console.warn('WebSocket fechado');
      },
    });
  }

  connect(): Promise<void> {
    if (this.isConnected) return Promise.resolve();

    return new Promise((resolve, reject) => {
      this.stompClient.activate();

      setTimeout(() => {
        if (this.isConnected) resolve();
        else reject();
      }, 3000);
    });
  }

  subscribe(topic: string, callback: (msg: any) => void): StompSubscription {
    return this.stompClient.subscribe(topic, (message: IMessage) => {
      callback(JSON.parse(message.body));
    });
  }

  send(destination: string, body: any) {
    if (!this.isConnected) {
      console.warn('WebSocket não está conectado. Ignorando envio.');
      return;
    }

    this.stompClient.publish({
      destination,
      body: JSON.stringify(body),
    });
  }

  disconnect() {
    if (this.stompClient && this.isConnected) {
      this.stompClient.deactivate().then(() => {
        this.isConnected = false;
        console.log('WebSocket desconectado');
      });

      clearInterval(this.pingInterval);
      clearTimeout(this.pongTimeout);
      this.pingInterval = null;
      this.pongTimeout = null;
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
  }

  reconectWebSocket() {
    if (this.reconnectionAttempts < this.maxReconnectionAttempts) {
      this.reconnectionAttempts++;
      console.warn(`Tentativa de reconexão ${this.reconnectionAttempts}`);
      setTimeout(() => {
        this.connect().catch(() => {
          console.error('Erro ao tentar reconectar WebSocket');
        });
      }, 3000);
    } else {
      console.error('Máximo de tentativas alcançado');
      this.desconectarWebSocket();
    }
  }

  startPing(intervalMs: number = 5000) {
    clearInterval(this.pingInterval);

    this.pingInterval = setInterval(() => {
      if (this.connected) {
        this.send('/app/ping', { mensagem: 'ping' });

        clearTimeout(this.pongTimeout);
        this.pongTimeout = setTimeout(() => {
          console.warn('Pong não recebido dentro do tempo limite!');
          this.desconectarWebSocket();
        }, this.pongTimeoutMs);
      }
    }, intervalMs);
  }

  subscribeToPong() {
    this.subscribe('/topic/pong', (_) => {
      clearTimeout(this.pongTimeout);
      this.pongTimeout = null;
    });
  }

  subscribeProgress() {
    this.subscribe('/topic/sync/progress', (data) => {
      clearTimeout(this.pongTimeout);
      // console.log('Progresso recebido:', data); 
      const progresso = Number(data?.progresso ?? 0);
      this.progressoSubject.next(progresso);

      const emAndamento = progresso > 0 && progresso < 100;
      this.emProgressoSubject.next(emAndamento);
    });
  }
}
