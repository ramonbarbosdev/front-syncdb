import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SelectBasicComponent } from '../component/select-basic/select-basic.component';
import { ButtonComponent } from '../component/button/button.component';
import { DadosService } from '../../services/dados.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { ProgressoService } from '../../services/progresso.service';
import { EstruturaCacheService } from '../../services/estruturacache.service';
import { TabelaEstrutura } from '../../models/tabela-estrutura';
import { TableBasicComponent } from '../component/table-basic/table-basic.component';
import { ProgressoBarComponent } from '../component/progresso-bar/progresso-bar.component';

@Component({
  selector: 'app-dados',
  imports: [RouterModule, ButtonComponent, CommonModule, SelectBasicComponent, TableBasicComponent, ProgressoBarComponent],
  templateUrl: './dados.component.html',
  styleUrl: './dados.component.scss'
})
export class DadosComponent {

  serviceDados = inject(DadosService);
  progressoService = inject(ProgressoService);
  estruturaCache = inject(EstruturaCacheService);
  router = inject(Router);

  bases: { nm_base: string }[] = [];
  baseSelecionada = '';
  fl_operacaoVerificar = false;
  fl_operacaoSincronizar = false;
  resultados: TabelaEstrutura[] = [];
  ds_operacao = 'Dados';

  colunasVisiveis = {
    tabela: true,
    acao: true, 
    querys: true,
    erro: false,
  };

  constructor()
  {
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
    this.serviceDados.buscarBaseExistente().subscribe({
      next: (bases) => {
        this.bases = bases.map((nm_base: string) => ({ nm_base }));
      },
      error: ({ error }) => this.exibirErro(`Erro ao carregar as ${this.ds_operacao}.`, error)
    });
  }

  private exibirErro(text: string, e: any)
  {
    Swal.fire({
      icon: 'error',
      title: e.error.message || e.status || 'Erro na operação',
      text:  e.error.details ||  text || e.error.error,
      confirmButtonText: 'OK'
    });
  }

  private setPermissaoOperacoes(ativo: boolean)
  {
    this.fl_operacaoVerificar = ativo;
    this.fl_operacaoSincronizar = ativo;
  }


  private atualizarErrosNaTabela(tabelasAfetadas: TabelaEstrutura[])
  {
    this.resultados = this.resultados.map(item => {
      const erro = tabelasAfetadas.find(tab => tab.tabela?.toLowerCase() === item.tabela.toLowerCase())?.erro || '';
      return { ...item, erro };
    });
  }

 

  verificar(): void
  {
    if (!this.baseSelecionada)
    {
      return this.exibirErro(`Erro ao verificar ${this.ds_operacao}. Nenhuma base selecionada.`, { code: 'Falha ao verificar' });
    }

    this.setPermissaoOperacoes(true);

    this.serviceDados.verificar(this.baseSelecionada).subscribe({
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
            text: `Não existe atualização de ${this.ds_operacao} das tabelas.`,
            confirmButtonText: 'OK'
          });
          this.limparTabela();
          this.fl_operacaoSincronizar = true;
        }
      },
      error: (e) => {
        this.setPermissaoOperacoes(false);
        this.exibirErro(`Erro ao verificar ${this.ds_operacao}.`, e);
      }
    });
  }

  execultarSincronizacao(): void
    {
      this.setPermissaoOperacoes(true);
  
      if (!this.resultados[0].tabela || !this.baseSelecionada) {
        Swal.fire({
          icon: 'error',
          title: `Erro de informações`,
          text: `Não existe ${this.ds_operacao} para sincronizar!`,
          confirmButtonText: 'OK'
        });
        return this.setPermissaoOperacoes(false);
      }
  
      this.progressoService.progresso = 0;
      this.progressoService.status = 'Iniciando processamento de querys';
  
      this.serviceDados.sincronizacao(this.baseSelecionada).subscribe({
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
