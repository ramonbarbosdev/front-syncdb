import { Component, inject } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu',
  imports: [RouterModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {

  private auth = inject(AuthService)
  sair()
  {
    this.auth.logout();
  }
}
