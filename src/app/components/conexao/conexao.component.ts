import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { HlmButtonDirective } from '@spartan-ng/helm/button';

import Swal from 'sweetalert2';
import { ConexaoService } from '../../services/conexao.service';
import { HeaderComponent } from '../component/header/header.component';
import { InputCustomComponent } from '../input-custom/input-custom.component';
import { BrnCommandImports } from '@spartan-ng/brain/command';
import {  HlmCardImports } from '@spartan-ng/helm/card';
import { FormsModule } from '@angular/forms';
import { UploadCertificadoComponent } from '../component/upload-certificado/upload-certificado.component';
import { CommonModule } from '@angular/common';
import { EventConexaoService } from '../../services/event-conexao.service';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import { AuthService } from '../../auth/auth.service';
import { BaseService } from '../../services/base.service';

@Component({
  selector: 'app-conexao',
  imports: [
    BrnCommandImports,
    HlmCardImports,
    HeaderComponent,
    InputCustomComponent,
    HlmButtonDirective,
    FormsModule,
    UploadCertificadoComponent,
    CommonModule,
    HlmCheckboxImports,
  ],
  templateUrl: './conexao.component.html',
  styleUrl: './conexao.component.scss',
})
export class ConexaoComponent implements OnInit {
  id_conexao?: string;

  arquivoValidado: boolean = false;

  public baseService = inject(BaseService);

  public cloud = {
    db_cloud_host: '',
    db_cloud_port: '',
    db_cloud_user: '',
    db_cloud_password: '',
    fl_admin: false,
  };
  public local = {
    db_local_host: '',
    db_local_port: '',
    db_local_user: '',
    db_local_password: '',
  };

  id_usuario = '';
  service = inject(ConexaoService);
  router = inject(Router);
  private eventService = inject(EventConexaoService);
  private auth = inject(AuthService);

  constructor() {}

  ngOnInit() {
    this.cancelarSincronizacao();
    this.id_usuario = this.auth.getUser().id_usuario ?? '';
    this.onShow();
    this.eventService.reload$.subscribe(() => this.onShow());
  }

  onShow() {
    this.service.getConexao(this.id_usuario).subscribe({
      next: (res: any) => {
        if (res) {
          this.arquivoValidado = res.cloud.fl_admin;
          this.id_conexao = res.id;
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
      },
    });
  }

  onSave() {
    const payload = {
      id: this.id_conexao,
      cloud: this.cloud,
      local: this.local,
      idUsuario: this.id_usuario,
    };

    if (this.id_conexao) {
      this.service.atualizarConexao(payload).subscribe({
        next: (res: any) => {
          this.router.navigate(['admin/dashboard']);
        },
        error: (err) => {},
      });
    } else {
      this.service.criarConexao(payload).subscribe({
        next: (res: any) => {
          Swal.fire({
            icon: 'success',
            title: 'Sucesso!',
            text: 'Nova conexão criada com sucesso.',
            confirmButtonText: 'OK',
          });
          this.id_conexao = res.id_conexao;

          this.router.navigate(['admin/dashboard']);
        },
        error: (err) => {
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

  cancelarSincronizacao() {


    this.baseService.cancelar('estrutura').subscribe({
      next: (resposta: any) => {
       
      },
    });

    this.baseService
      .cancelar('dados')
      .subscribe({
        next: (resposta: any) => {
        
        },
      });
  }
}
