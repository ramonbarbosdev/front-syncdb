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

  service = inject(DadosService);
  progressoService = inject(ProgressoService);
  estruturaCache = inject(EstruturaCacheService);
  router = inject(Router);

  selectBases: { nm_option: string }[] = [];
  selectEsquema: { nm_option: string }[] = [];
  selectTabelas: { nm_option: string }[] = [];

  baseSelecionada = '';
  esquemaSelecionada = '';
  tabelaSelecionada = '';

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
    this.progressoService.status = `Verificação de ${this.ds_operacao}` ;
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
    this.carregarEsquema();
  }

  processarEsquema()
  {
    this.carregarTabelas();
  }


  permissaoBotao(acao: boolean)
  {
    this.fl_operacaoVerificar = acao;
    this.fl_operacaoSincronizar = acao;
  }

  private carregarBases(): void
  {
    this.service.buscarBaseExistente().subscribe({
      next: (item) => {
        this.selectBases = item.map((nm_option: string) => ({ nm_option }));
      },
      error: ({ error }) => this.exibirErro(`Erro ao carregar as ${this.ds_operacao}.`, error)
    });
  }
  private carregarEsquema(): void
  {
    this.service.buscarEsquemaExistente(this.baseSelecionada).subscribe({
      next: (item) => {
        this.selectEsquema = item.map((nm_option: string) => ({ nm_option }));
      },
      error: ({ error }) => this.exibirErro(`Erro ao carregar as ${this.ds_operacao}.`, error)
    });
  }
  private carregarTabelas(): void
  {
    this.service.buscarTabelaExistente(this.baseSelecionada, this.esquemaSelecionada).subscribe({
      next: (item) => {
        this.selectTabelas = item.map((nm_option: string) => ({ nm_option }));
      },
      error: ({ error }) => this.exibirErro(`Erro ao carregar as ${this.ds_operacao}.`, error)
    });
  }

  private exibirErro(text: string, e: any)
  {
    Swal.fire({
      icon: 'error',
      title: e.error.mensagem || e.status || 'Erro na operação',
      text:  e.error.detalhes ||  text || e.error.erro,
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

    let tabelaEsquema = !this.tabelaSelecionada ? this.esquemaSelecionada : this.tabelaSelecionada ;

    this.service.verificar(this.baseSelecionada, tabelaEsquema).subscribe({
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
  
      this.service.sincronizacao(this.baseSelecionada).subscribe({
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
