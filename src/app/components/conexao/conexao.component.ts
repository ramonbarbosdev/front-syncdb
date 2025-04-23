import { Component, inject, OnInit } from '@angular/core';
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
export class ConexaoComponent implements OnInit {
  private id_conexao?: number;

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

  constructor() { }

  ngOnInit() {
    this.onShow();
  }

  onShow() {
    this.service.getConexao().subscribe({
      next: (res: any) => {
        if (res) {
          this.id_conexao = res.id_conexao;
          this.cloud = res.cloud;
          this.local = res.local;
        }
      },
      error: (err) => {
        console.error(err);
        Swal.fire({
          icon: 'warning',
          title: 'Aviso',
          text: 'Não existe conexãos cadastradas',
          confirmButtonText: 'OK',
        });
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
    else {
      this.service.criarConexao(payload).subscribe({
        next: (res: any) => {
          Swal.fire({
            icon: 'success',
            title: 'Sucesso!',
            text: 'Nova conexão criada com sucesso.',
            confirmButtonText: 'OK',
          });
          this.id_conexao = res.id_conexao;
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
