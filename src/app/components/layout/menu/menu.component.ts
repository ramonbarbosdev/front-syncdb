import { Component, inject } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-menu',
  imports: [RouterModule, FormsModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {

  private auth = inject(AuthService)
  menuAberto = false;
  termoBusca = '';

  
  sair()
  {
    this.auth.logout();
  }

  buscar()
  {
    console.log(this.termoBusca);
  }
}
