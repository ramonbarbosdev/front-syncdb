import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-websocket-example',
  imports: [ CommonModule, FormsModule],
  template: `
    <div>
      <button (click)="connect()">Conectar</button>
      <button (click)="sendMessage()">Enviar Mensagem</button>
      <div *ngIf="messages.length > 0">
        <h3>Mensagens Recebidas:</h3>
        <ul>
          <li *ngFor="let msg of messages">{{ msg }}</li>
        </ul>
      </div>
    </div>
  `,
})
export class WebSocketExampleComponent implements OnInit, OnDestroy {
  private socket!: WebSocket;
  public messages: string[] = [];

  constructor() {}

  ngOnInit() {
    this.connect();
  }

  connect() {
    // Substitua pela URL do seu WebSocket (ws:// ou wss://)

    const url1 = 'ws://localhost:8080/syncdb/stocks';
    const url2 = 'ws://127.0.0.1:8080/syncdb/stocks';
    const url3 = 'ws://' + window.location.host + '/syncdb/stocks';

    this.socket = new WebSocket(url1);

    this.socket.onopen = (event) => {
      console.log('Conexão WebSocket aberta', event);
      this.messages.push('Conectado ao WebSocket!');
    };

    this.socket.onmessage = (event) => {
      console.log('Mensagem recebida:', event.data);
      this.messages.push(event.data);
    };

    this.socket.onerror = (error) => {
      console.error('Erro no WebSocket:', error);
      this.messages.push('Erro na conexão WebSocket!');
    };

    this.socket.onclose = (event) => {
      console.log('Conexão WebSocket fechada', event);
      this.messages.push('Conexão WebSocket fechada.');
    };
  }

  sendMessage() {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send('Olá, servidor WebSocket!');
    } else {
      console.error('WebSocket não está conectado.');
    }
  }

  ngOnDestroy() {
    if (this.socket) {
      this.socket.close(); // Fecha a conexão ao sair do componente
    }
  }
}