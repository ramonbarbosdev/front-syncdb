import { Component } from '@angular/core';
import { WebsocketService } from '../../services/websocket.service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  constructor(private websocketService: WebsocketService) {}
  ngOnInit(): void {
    this.websocketService.connect(() => {
      this.websocketService.subscribe('/topic/sync', (data) => {
        console.log('Mensagem recebida do WebSocket:', data);
      });
  
      // Enviar exemplo
      this.websocketService.send('/app/send', { msg: 'Hello Spring!' });
    });
  }
}
