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
  styleUrl: './conexao.component.scss',
})
export class ConexaoComponent {
  private id_conexao?: number; // Pode ser undefined no início!

  public cloud = {
    db_cloud_host: '',
    db_cloud_port: '',
    db_cloud_user: '',
    db_cloud_password: '',
  };
  public local = {
    db_local_host: '',
    db_local_port: '',
    db_local_user: '',
    db_local_password: '',
  };

  service = inject(ConexaoService);

  constructor() {
    this.service.getConexao().subscribe((data) => {
      if (data) {
        this.id_conexao = data.id_conexao;
        this.cloud = data.cloud;
        this.local = data.local;
      }
    });
  }

  onSave() {
    const payload = {
      id_conexao: this.id_conexao,
      cloud: this.cloud,
      local: this.local,
    };

    if (this.id_conexao)
    {
      this.service.atualizarConexao(payload).subscribe({
        next: (res: any) => {
          Swal.fire({
            icon: 'success',
            title: 'Sucesso!',
            text: 'Conexões atualizadas com sucesso.',
            confirmButtonText: 'OK',
          });
        },
        error: (err) => {
          console.error(err);
          Swal.fire({
            icon: 'error',
            title: 'Erro ao atualizar',
            text: 'Verifique os dados de conexão.',
            confirmButtonText: 'OK',
          });
        },
      });
    }
    // Se não existe id, cria novo (POST)
    else {
      this.service.criarConexao(payload).subscribe({
        next: (res: any) => {
          Swal.fire({
            icon: 'success',
            title: 'Sucesso!',
            text: 'Nova conexão criada com sucesso.',
            confirmButtonText: 'OK',
          });
        },
        error: (err) => {
          console.error(err);
          Swal.fire({
            icon: 'error',
            title: 'Erro ao criar',
            text: 'Verifique os dados de conexão.',
            confirmButtonText: 'OK',
          });
        },
      });
    }
  }
}
