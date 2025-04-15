import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

import { EstruturaService } from '../../services/estrutura.service';
import { ProgressoService } from '../../services/progresso.service';
import { EstruturaCacheService } from '../../services/estruturacache.service';

import { SelectBasicComponent } from '../component/select-basic/select-basic.component';
import { ButtonComponent } from '../component/button/button.component';
import { ProgressoBarComponent } from '../component/progresso-bar/progresso-bar.component';
import { TableBasicComponent } from '../component/table-basic/table-basic.component';

import { TabelaEstrutura } from '../../models/tabela-estrutura';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-estrutura',
  imports: [
    CommonModule,
    FormsModule,
    SelectBasicComponent,
    ButtonComponent,
    ProgressoBarComponent,
    TableBasicComponent,
    RouterModule
  ],
  templateUrl: './estrutura.component.html',
  styleUrl: './estrutura.component.scss'
})
export class EstruturaComponent
{
  serviceEstrutura = inject(EstruturaService);
  progressoService = inject(ProgressoService);
  estruturaCache = inject(EstruturaCacheService);
  router = inject(Router);

  bases: { nm_base: string }[] = [];
  baseSelecionada = '';
  fl_operacaoVerificar = false;
  fl_operacaoSincronizar = false;
  resultados: TabelaEstrutura[] = [];

  constructor() {
    this.inicializarComponente();
  }

  inicializarComponente(): void
  {
    this.progressoService.progresso = 0;
    this.progressoService.status = 'Verificação da estrutura';
    this.carregarBases();
    this.iniciarTabela();
  }

  iniciarTabela(): void {
    this.resultados =  [{ tabela: '', acao: '', erro: '', querys: '' }];
  }

  carregarBases(): void {
    this.serviceEstrutura.buscarBaseExistente().subscribe({
      next: (bases) => {
        this.bases = bases.map((nm_base: string) => ({ nm_base }));
      },
      error: ({ error }) => {
        Swal.fire({
          icon: 'error',
          title: error.code || 'Erro',
          text: error.error || 'Erro ao carregar as bases.',
          confirmButtonText: 'OK'
        });
      }
    });
  }

  processarBaseDados()
  {
    this.inicializarComponente();
  }

  permissaoBotao(acao: boolean)
  {
    this.fl_operacaoVerificar = acao;
    this.fl_operacaoSincronizar = acao
  }

  verificarEstrutura(): void 
  {
    if (this.baseSelecionada)
    {
      this.permissaoBotao(true);

      this.serviceEstrutura.verificarEstrutura(this.baseSelecionada).subscribe({
        next: ({ tabelas_afetadas }) =>
        {
          this.permissaoBotao(false);
  
          if (tabelas_afetadas?.length)
          {
            this.resultados = tabelas_afetadas.map((x: TabelaEstrutura) => ({
              tabela: x.tabela,
              acao: x.acao,
              querys: x.querys,
              erro: x.erro,
            }));
            // this.estruturaCache.setTabelas(this.resultados);
          }
          else
          {
            Swal.fire({
              icon: 'error',
              title: `Sem resposta`,
              text: 'Não existe atualização na estrutura das tabelas.',
              confirmButtonText: 'OK'
            });
            this.iniciarTabela();
          }
        },
        error: (e) => {
          this.permissaoBotao(false);
          Swal.fire({
            icon: 'error',
            title: `Erro ${e.status}`,
            text: e.error?.details || 'Erro ao verificar estrutura.',
            confirmButtonText: 'OK'
          });
        }
      });
    }
    else
    {
      Swal.fire({
        icon: 'error',
        title: `Falha ao verificar`,
        text: 'Erro ao verificar estrutura. Nenhuma base selecionada.',
        confirmButtonText: 'OK'
      });
    }
    
  }

  execultarSincronizacaoEstrutura()
  {
    this.permissaoBotao(true);
    if(this.resultados?.length > 0 && this.baseSelecionada)
    {
      this.serviceEstrutura.sincronizacaoEstrutura(this.baseSelecionada).subscribe({
        next: (item) =>
        {
          this.permissaoBotao(false);
                  console.log(item) 
          if(item.success)
          {
            Swal.fire({
              icon: 'success',
              title: `Sucesso`,
              text: item.mensagem,
              confirmButtonText: 'OK'
            });

            // this.inicializarComponente();
            // this.router.navigate(['admin/dashboard'])
          }
         
        },
        error: (e) => {
          this.permissaoBotao(false);
          Swal.fire({
            icon: 'error',
            title: `Falha na sincronização`,
            text: e.error.mensagem,
            confirmButtonText: 'OK'
          });
        }
      });
      
    }
    else
    {
      Swal.fire({
        icon: 'error',
        title: `Erro de informações`,
        text: 'Não existe estrutura para sincronizar!',
        confirmButtonText: 'OK'
      });
      this.permissaoBotao(false);
    }
  }
}
