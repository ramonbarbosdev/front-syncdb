import { inject, Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ProgressoService {
  public progresso = 0;
  public mensagem = '';
  public status = '';
  private route = inject(Router);

  constructor(private ws: WebsocketService) {
    this.initWebSocket();
  }

  private async initWebSocket() {
    try {
      await this.ws.connect(); // Espera a conexão antes de prosseguir
      this.ws.subscribe('/topic/sync/progress', (data: any) => {
        this.progresso = data.progresso;
        this.mensagem = data.mensagem;
        this.status = data.status;
      });
    } catch (error) {
      console.error('[ProgressoService] Erro ao conectar WebSocket:', error);
      this.route.navigate(['/login']); 
       Swal.fire({
                    icon: 'error',
                    title: 'Erro ao conectar WebSocket',
                    text: '[ProgressoService] Não foi possível conectar ao WebSocket.',
                  });

    }
  }
}
