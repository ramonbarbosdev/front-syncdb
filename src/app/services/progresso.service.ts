import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';

@Injectable({
  providedIn: 'root'
})
export class ProgressoService {
  public progresso = 0;
  public mensagem = '';

  constructor(private ws: WebsocketService) {
    this.initWebSocket();
  }

  private initWebSocket() {
    this.ws.connect(() => {
      this.ws.subscribe('/topic/sync/progress', (data: any) => {
        console.log('Mensagem recebida:', data.mensagem);
        this.progresso = data.progresso;
        this.mensagem = data.mensagem;
      });
    });
  }
}
