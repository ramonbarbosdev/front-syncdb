import { Component, Inject, inject, Type } from '@angular/core';
import Swal from 'sweetalert2';
import { exibirErro } from '../../utils/swalMensagem.utils';
import { TabelaEstrutura } from '../../models/tabela-estrutura';
import { ProgressoService } from '../../services/progresso.service';
import { EstruturaCacheService } from '../../services/estruturacache.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-estrutura-dados',
  imports: [],
  templateUrl: './estrutura-dados.component.html',
  styleUrl: './estrutura-dados.component.scss'
})
export abstract  class EstruturaDadosComponent<TService>
{

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

  abstract ds_operacao: string;

  protected constructor(@Inject('TService') protected service: TService)
  {
    this.inicializarComponente();
  }

  inicializarComponente(): void {
    this.iniciarProgresso();
    this.carregarBases();
    this.limparTabela();
  }

  iniciarProgresso() {
    this.progressoService.progresso = 0;
    this.progressoService.status = `Verificação de ${this.ds_operacao}`;
  }

  limparTabela() {
    this.resultados = [{ tabela: '', acao: '', erro: '', querys: '' }];
  }

  processarBaseDados() {
    this.inicializarComponente();
    this.carregarEsquema();
    this.carregarTabelas();
    this.selectTabelas = [];
  }

  processarEsquema() {
    this.carregarTabelas();
  }

  permissaoBotao(acao: boolean) {
    this.fl_operacaoVerificar = acao;
    this.fl_operacaoSincronizar = acao;
  }

  carregarBases() {
    (this.service as any).buscarBaseExistente().subscribe({
      next: (item: string[]) => {
        this.selectBases = item.map(nm_option => ({ nm_option }));
      },
      error: ( error : any) => exibirErro(`Erro ao carregar ${this.ds_operacao}.`, error)
    });
  }

  carregarEsquema() {
    if (!this.baseSelecionada) return;

    (this.service as any).buscarEsquemaExistente(this.baseSelecionada).subscribe({
      next: (item: string[]) => {
        this.selectEsquema = item.map(nm_option => ({ nm_option }));
      },
      error: (error : any) => exibirErro(`Erro ao carregar ${this.ds_operacao}.`, error)
    });
  }

  carregarTabelas() {
    if (!this.esquemaSelecionada) return;

    (this.service as any).buscarTabelaExistente(this.baseSelecionada, this.esquemaSelecionada).subscribe({
      next: (item: string[]) => {
        this.selectTabelas = item.map(nm_option => ({ nm_option }));
      },
      error: ( error : any) => exibirErro(`Erro ao carregar ${this.ds_operacao}.`, error)
    });
  }

  atualizarErrosNaTabela(tabelasAfetadas: TabelaEstrutura[]) {
    this.resultados = this.resultados.map(item => {
      const erro = tabelasAfetadas.find(tab => tab.tabela?.toLowerCase() === item.tabela.toLowerCase())?.erro || '';
      return { ...item, erro };
    });
  }

  setPermissaoOperacoes(ativo: boolean) {
    this.fl_operacaoVerificar = ativo;
    this.fl_operacaoSincronizar = ativo;
  }

  verificar() {
    if (!this.baseSelecionada) return exibirErro(`Erro ao verificar ${this.ds_operacao}. Nenhuma base selecionada.`, null);
    if (!this.esquemaSelecionada) return exibirErro(`Erro ao verificar ${this.ds_operacao}. Nenhum esquema selecionado.`, null);

    this.verificarExistenciaEsquema(this.baseSelecionada, this.esquemaSelecionada);
  }

  verificarExistenciaEsquema(baseSelecionada: string, esquemaSelecionada: string)
  {
    (this.service as any).verificarExistenciaEsquema(baseSelecionada, esquemaSelecionada).subscribe({
      next: () => {
        let tabelaEsquema = !this.tabelaSelecionada ? this.esquemaSelecionada : this.tabelaSelecionada;
        this.continuarVerificacao(tabelaEsquema);
      },
      error: (e: any) => {
        exibirErro(`Erro ao verificar ${this.ds_operacao}.`, e);
      }
    });
  }

  continuarVerificacao(tabelaEsquema: string) {
    this.setPermissaoOperacoes(true);

    (this.service as any).verificar(this.baseSelecionada,this.esquemaSelecionada, tabelaEsquema).subscribe({
      next: ({ tabelas_afetadas }: any) => {
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
          this.iniciarProgresso();
        }
      },
      error: (e: any) => {
        this.setPermissaoOperacoes(false);
        exibirErro(`Erro ao verificar ${this.ds_operacao}.`, e);
      }
    });
  }

  execultarSincronizacao() {
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
    // this.progressoService.status = 'Iniciando processamento de querys';

    (this.service as any).sincronizacao(this.baseSelecionada).subscribe({
      next: (resposta: any) => {
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
      error: (e: any) => {
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
