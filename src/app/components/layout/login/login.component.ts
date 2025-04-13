import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../auth/auth.service';
import Swal from 'sweetalert2';
import { InputPasswordComponent } from '../../component/input-password/input-password.component';
import { InputTextComponent } from '../../component/input-text/input-text.component';
import { ButtonComponent } from '../../component/button/button.component';

@Component({
  selector: 'app-login',
  imports: [FormsModule, InputPasswordComponent, InputTextComponent, ButtonComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent
{
    login!: string;
    senha!:string;

    router =  inject(Router);

    constructor(private auth: AuthService){}

    logar()
    {

        this.auth.login({login: this.login, senha: this.senha}).subscribe({
          next: (res: any) => {
            this.auth.setToken(res.Authorization);
            this.router.navigate(['admin/dashboard'])
          },
          error: err =>
          {
            console.log(err)
            Swal.fire({
                      icon: 'error',
                      title: "Login inválido",
                      text: "Login ou senha incorreto",
                      confirmButtonText: 'OK'
                    });
          } 
        }) 
  
    }

}
