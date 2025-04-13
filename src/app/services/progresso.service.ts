import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';

@Injectable({
  providedIn: 'root'
})
export class ProgressoService {
  public progresso = 0;
  public mensagem = '';
  public status = '';

  constructor(private ws: WebsocketService) {
    this.initWebSocket();
  }

  private async initWebSocket() {
    try {
      await this.ws.connect();
      this.ws.subscribe('/topic/sync/progress', (data: any) => {
        this.progresso = data.progresso;
        this.mensagem = data.mensagem;
        this.status = data.status;
      });
    } catch (error) {
      console.error('[ProgressoService] Erro ao conectar WebSocket:', error);
    }
  }
}
