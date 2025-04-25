import { Component, inject } from '@angular/core';
import { InputTextComponent } from '../../component/input-text/input-text.component';
import { InputPasswordComponent } from '../../component/input-password/input-password.component';
import { ButtonComponent } from '../../component/button/button.component';
import Swal from 'sweetalert2';
import { exibirErro } from '../../../utils/swalMensagem.utils';
import { AuthService } from '../../../auth/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [
    InputTextComponent,
    InputPasswordComponent,
    ButtonComponent,
    RouterModule,
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

  auth = inject(AuthService);
  router = inject(Router);

  cadastrar() {
    this.auth.cadastrar(this.objeto).subscribe({
      next: (res: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Cadastro realizado com sucesso!',
          text: 'Você pode fazer login agora.',
          confirmButtonText: 'OK',
        });
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.log(err);
        exibirErro(``, err);
      },
    });
  }
}
