import { Component, inject } from '@angular/core';
import { InputTextComponent } from '../../component/input-text/input-text.component';
import { InputPasswordComponent } from '../../component/input-password/input-password.component';
import { ButtonComponent } from '../../component/button/button.component';
import Swal from 'sweetalert2';
import { exibirErro } from '../../../utils/swalMensagem.utils';
import { AuthService } from '../../../auth/auth.service';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../component/header/header.component';
import { HlmSpinnerComponent } from '@spartan-ng/helm/spinner';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-register',
  imports: [
    InputTextComponent,
    InputPasswordComponent,
    ButtonComponent,
    RouterModule,
    HeaderComponent,
    HlmSpinnerComponent,
    CommonModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  public objeto = {
    login: '',
    nome: '',
    senha: '',
    token: '',
  };

  loading = false;

  auth = inject(AuthService);
  router = inject(Router);

  cadastrar() {
    this.loading = true;

    this.auth.cadastrar(this.objeto).subscribe({
      next: (res: any) => {
        this.loading = false;
        Swal.fire({
          icon: 'success',
          title: 'Cadastro realizado com sucesso!',
          text: 'Você pode fazer login agora.',
          confirmButtonText: 'OK',
        });
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        console.log(err);
        exibirErro(``, err);
      },
    });
  }
}
