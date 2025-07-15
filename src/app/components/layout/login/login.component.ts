import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../auth/auth.service';
import Swal from 'sweetalert2';
import { InputPasswordComponent } from '../../component/input-password/input-password.component';
import { InputTextComponent } from '../../component/input-text/input-text.component';
import { WebsocketService } from '../../../services/websocket.service';
import { HlmSpinnerComponent } from '@spartan-ng/helm/spinner';
import { CommonModule } from '@angular/common';
import { exibirErro } from '../../../utils/swalMensagem.utils';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    FormsModule,
    InputPasswordComponent,
    InputTextComponent,
    RouterModule,
    HlmSpinnerComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  public objeto = {
    login: '',
    senha: '',
  };

  loading = false;

  router = inject(Router);
  websocketService = inject(WebsocketService);

  constructor(private auth: AuthService) {}

  logar() {
    this.loading = true;

    if (!this.objeto.login || !this.objeto.senha) {
      exibirErro(`Necessario informar em todos os campos.`, null);
      this.loading = false;
      return;
    }

    this.auth.login(this.objeto).subscribe({
      next: (res: any) => {
        this.websocketService
          .connect()
          .then(() => {
            this.auth.setUser(res);
            console.log('[Login OK + WebSocket conectado]');
            this.loading = false;
            this.auth.setToken(res.Authorization);
            this.router.navigate(['admin/dashboard']);
          })
          .catch((err) => {
            this.loading = false;
            console.error('[Erro ao conectar WebSocket após login]', err);
            Swal.fire({
              icon: 'error',
              title: 'Erro de Conexão',
              text: 'Não foi possível conectar ao WebSocket.',
            });
          });
      },
      error: (err) => {
        this.loading = false;
        console.log(err);
        Swal.fire({
          icon: 'error',
          title: 'Login inválido',
          text: 'Login ou senha incorreto',
          confirmButtonText: 'OK',
        });
      },
    });
  }
}
