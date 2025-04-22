import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { InputTextComponent } from '../component/input-text/input-text.component';
import { ButtonComponent } from '../component/button/button.component';
import Swal from 'sweetalert2';
import { ConexaoService } from '../../services/conexao.service';

@Component({
  selector: 'app-conexao',
  imports: [RouterModule, InputTextComponent, ButtonComponent],
  templateUrl: './conexao.component.html',
  styleUrl: './conexao.component.scss'
})
export class ConexaoComponent {

  public cloud = {
    db_cloud_host: "",
    db_cloud_port: "",
    db_cloud_user: "",
    db_cloud_password: ""
  }
  public local = {
    db_local_host: "",
    db_local_port: "",
    db_local_user: "",
    db_local_password: ""
  }

  service = inject(ConexaoService);

  onSave()
  {

    const payload = {
      cloud: this.cloud,
      local: this.local
    };
     this.service.salvarDadosConexao(payload).subscribe
     ({
        next: (res: any) => {

          Swal.fire({
            icon: 'success',
            title: 'Sucesso!',
            text: 'Conexões salvas com sucesso.',
            confirmButtonText: 'OK'
          });
        },
        error: err =>
        {
          console.log(err)
          Swal.fire({
            icon: 'error',
            title: "Erro ao salvar",
            text: "Verifique os dados de conexão.",
            confirmButtonText: 'OK'
          });
        }
    })
  }

}
