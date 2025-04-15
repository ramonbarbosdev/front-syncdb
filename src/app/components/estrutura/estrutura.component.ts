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

  colunasVisiveis = {
    tabela: true,
    acao: true, 
    querys: true,
    erro: false,
  };

  constructor() {
    this.inicializarComponente();
  }

  inicializarComponente(): void
  {
    this.progressoService.progresso = 0;
    this.progressoService.status = 'Verificação da estrutura';
    this.carregarBases();
    this.limparTabela();
  }

  private limparTabela(): void
  {
    this.resultados = [{ tabela: '', acao: '', erro: '', querys: '' }];
  }


  processarBaseDados()
  {
    this.inicializarComponente();
  }

  permissaoBotao(acao: boolean)
  {
    this.fl_operacaoVerificar = acao;
    this.fl_operacaoSincronizar = acao;
  }

  private carregarBases(): void
  {
    this.serviceEstrutura.buscarBaseExistente().subscribe({
      next: (bases) => {
        this.bases = bases.map((nm_base: string) => ({ nm_base }));
      },
      error: ({ error }) => this.exibirErro('Erro ao carregar as bases.', error)
    });
  }

  private exibirErro(text: string, error: any)
  {
    Swal.fire({
      icon: 'error',
      title: error.code || 'Erro',
      text: error.error || text,
      confirmButtonText: 'OK'
    });
  }

  private atualizarErrosNaTabela(tabelasAfetadas: TabelaEstrutura[])
  {
    this.resultados = this.resultados.map(item => {
      const erro = tabelasAfetadas.find(tab => tab.tabela?.toLowerCase() === item.tabela.toLowerCase())?.erro || '';
      return { ...item, erro };
    });
  }

  private setPermissaoOperacoes(ativo: boolean)
  {
    this.fl_operacaoVerificar = ativo;
    this.fl_operacaoSincronizar = ativo;
  }

  
  verificarEstrutura(): void
  {
    if (!this.baseSelecionada)
    {
      return this.exibirErro('Erro ao verificar estrutura. Nenhuma base selecionada.', { code: 'Falha ao verificar' });
    }

    this.setPermissaoOperacoes(true);

    this.serviceEstrutura.verificarEstrutura(this.baseSelecionada).subscribe({
      next: ({ tabelas_afetadas }) => {
        this.setPermissaoOperacoes(false);

        if (tabelas_afetadas?.length) {
          this.resultados = tabelas_afetadas.map((x: TabelaEstrutura) => ({
            tabela: x.tabela,
            acao: x.acao,
            querys: x.querys,
            erro: x.erro,
          }));
          this.estruturaCache.setTabelas(this.resultados);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Sem resposta',
            text: 'Não existe atualização na estrutura das tabelas.',
            confirmButtonText: 'OK'
          });
          this.limparTabela();
          this.fl_operacaoSincronizar = true;
        }
      },
      error: (e) => {
        this.setPermissaoOperacoes(false);
        this.exibirErro('Erro ao verificar estrutura.', e);
      }
    });
  }

  execultarSincronizacaoEstrutura(): void
  {
    this.setPermissaoOperacoes(true);

    if (!this.resultados[0].tabela || !this.baseSelecionada) {
      Swal.fire({
        icon: 'error',
        title: `Erro de informações`,
        text: 'Não existe estrutura para sincronizar!',
        confirmButtonText: 'OK'
      });
      return this.setPermissaoOperacoes(false);
    }

    this.progressoService.progresso = 0;
    this.progressoService.status = 'Iniciando processamento de querys';

    this.serviceEstrutura.sincronizacaoEstrutura(this.baseSelecionada).subscribe({
      next: (resposta) => {
        this.setPermissaoOperacoes(false);

        if (resposta?.tabelas_afetadas?.length) {
          this.atualizarErrosNaTabela(resposta.tabelas_afetadas);
        } else {
          Swal.fire({
            icon: 'success',
            title: 'Concluído',
            text: resposta.mensagem,
            confirmButtonText: 'OK'
          });
          this.router.navigate(['admin/dashboard']);
        }
      },
      error: (e) => {
        this.setPermissaoOperacoes(false);
        Swal.fire({
          icon: 'error',
          title: 'Falha na sincronização',
          text: e.error.mensagem,
          confirmButtonText: 'OK'
        });
      }
    });
  }
}
