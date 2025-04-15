import { Component, inject } from '@angular/core';
import { WebsocketService } from '../../services/websocket.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  router = inject(Router)

  abrirEstrutura()
  {
    this.router.navigate(['admin/estrutura'])
  }
  abrirDados()
  {
    this.router.navigate(['admin/dados'])
  }
}
