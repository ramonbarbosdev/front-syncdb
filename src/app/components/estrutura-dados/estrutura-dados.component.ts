import { Component, Inject, inject, Type } from '@angular/core';
import Swal from 'sweetalert2';
import { exibirErro } from '../../utils/swalMensagem.utils';
import { TabelaEstrutura } from '../../models/tabela-estrutura';
import { ProgressoService } from '../../services/progresso.service';
import { EstruturaCacheService } from '../../services/estruturacache.service';
import { Router } from '@angular/router';
import { WebsocketService } from '../../services/websocket.service';
import { BaseService } from '../../services/base.service';

@Component({
  selector: 'app-estrutura-dados',
  imports: [],
  templateUrl: './estrutura-dados.component.html',
  styleUrl: './estrutura-dados.component.scss',
})
export abstract class EstruturaDadosComponent<TService> {
  estruturaCache = inject(EstruturaCacheService);
  router = inject(Router);

  selectBases: { nm_option: string }[] = [];
  selectEsquema: { nm_option: string }[] = [];
  selectTabelas: { nm_option: string }[] = [];

  baseSelecionada = '';
  esquemaSelecionada: string = '';
  tabelaSelecionada = '';

  fl_operacaoVerificar = false;
  fl_operacaoSincronizar = false;

  resultados: TabelaEstrutura[] = [];

  progressoService = inject(ProgressoService);
  wsService = inject(WebsocketService);
  baseService = inject(BaseService);

  abstract ds_operacao: string;
  protected abstract get endpoint(): string;

  protected constructor(@Inject('TService') protected service: TService) {
    this.inicializarComponente();
  }

  inicializarComponente(): void {
    this.iniciarProgresso('');
    this.carregarBases();
    this.limparTabela();
    this.cancelarSincronizacao();
  }

  iniciarProgresso(acao: string = ''): void {
    this.progressoService.progresso = 0;
    this.progressoService.status = acao;
    this.progressoService.emProgresso = false;
  }

  limparTabela() {
    this.resultados = [{ tabela: '', acao: '', erro: '' }];
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
    this.esquemaSelecionada = '';
    this.tabelaSelecionada = '';

    (this.baseService as any).buscarBaseExistente().subscribe({
      next: (item: string[]) => {
        this.selectBases = item.map((nm_option) => ({ nm_option }));
      },
    });
  }

  carregarEsquema() {
    if (!this.baseSelecionada) return;

    (this.baseService as any)
      .buscarEsquemaExistente(this.baseSelecionada)
      .subscribe({
        next: (item: string[]) => {
          this.selectEsquema = item.map((nm_option) => ({ nm_option }));
        },
      });
  }

  carregarTabelas() {
    if (!this.esquemaSelecionada) return;
    this.tabelaSelecionada = '';

    (this.baseService as any)
      .buscarTabelaExistente(this.baseSelecionada, this.esquemaSelecionada)
      .subscribe({
        next: (item: string[]) => {
          this.selectTabelas = item.map((nm_option) => ({ nm_option }));
        },
      });
  }

  atualizarErrosNaTabela(tabelasAfetadas: TabelaEstrutura[]) {
    this.resultados = this.resultados.map((item) => {
      console.log(item);
      const erro =
        tabelasAfetadas.find(
          (tab) => tab.tabela?.toLowerCase() === item.tabela.toLowerCase()
        )?.erro || '';
      return { ...item, erro };
    });
  }

  setPermissaoOperacoes(ativo: boolean) {
    this.fl_operacaoVerificar = ativo;
    this.fl_operacaoSincronizar = ativo;
  }

  verificar() {
    if (!this.baseSelecionada) {
      return exibirErro(
        `Erro ao verificar ${this.ds_operacao}. Nenhuma base selecionada.`,
        null
      );
    }

    if (!this.esquemaSelecionada) {
      return exibirErro(
        `Erro ao verificar ${this.ds_operacao}. Nenhum esquema selecionado.`,
        null
      );
    }

    if (this.progressoService.emProgresso)
      return exibirErro(`Ação bloqueada: há um progresso em andamento.`, null);

    this.verificarExistenciaEsquema(
      this.baseSelecionada,
      this.esquemaSelecionada
    );
  }

  verificarExistenciaEsquema(
    baseSelecionada: string,
    esquemaSelecionada: string
  ) {
    (this.baseService as any)
      .verificarExistenciaEsquema(baseSelecionada, esquemaSelecionada)
      .subscribe({
        next: () => {
          let tabelaEsquema = !this.tabelaSelecionada
            ? this.esquemaSelecionada
            : this.tabelaSelecionada;
          this.continuarVerificacao(tabelaEsquema);
        },
      });
  }

  continuarVerificacao(tabelaEsquema: string) {
    this.setPermissaoOperacoes(true);
    this.iniciarProgresso('Verificando');
    this.limparTabela();

    (this.baseService as any)
      .verificar(
        this.endpoint,
        this.baseSelecionada,
        this.esquemaSelecionada,
        tabelaEsquema
      )
      .subscribe({
        next: (resposta: any) => {
          this.setPermissaoOperacoes(false);
          if (
            resposta.tabelas_afetadas?.length > 0 &&
            Array.isArray(resposta.tabelas_afetadas)
          ) {
            this.resultados = resposta.tabelas_afetadas.map(
              (x: TabelaEstrutura) => ({
                tabela: x.tabela,
                acao: x.acao,
                // queris: x.querys,
                erro: x.erro,
              })
            );
          } else if (
            resposta.tabelas_afetadas?.length <= 0 &&
            Array.isArray(resposta.tabelas_afetadas)
          ) {
            this.fl_operacaoSincronizar = true;
            this.limparTabela();
            exibirErro(
              `Não existe atualização de ${this.ds_operacao} das tabelas.`,
              null
            );
          }
        },
      });
  }

  execultarSincronizacao() {
    if (this.progressoService.emProgresso)
      return exibirErro(`Ação bloqueada: há um progresso em andamento.`, null);

    this.setPermissaoOperacoes(true);

    if (!this.resultados[0].tabela || !this.baseSelecionada) {
      Swal.fire({
        icon: 'error',
        title: `Erro de informações`,
        text: `Não existe ${this.ds_operacao} para sincronizar!`,
        confirmButtonText: 'OK',
      });
      this.iniciarProgresso();
      return this.setPermissaoOperacoes(false);
    }

    this.iniciarProgresso('Executando');

    (this.baseService as any)
      .sincronizacao(this.endpoint, this.baseSelecionada)
      .subscribe({
        next: (resposta: any) => {
          this.cancelarSincronizacao();

          if (resposta?.error?.length) {
            Swal.fire({
              icon: 'error',
              title: 'Erros ao executar',
              text: resposta.error,
              confirmButtonText: 'OK',
            });
          } else {
            Swal.fire({
              icon: 'success',
              title: 'Concluído',
              text: resposta.mensagem,
              confirmButtonText: 'OK',
            });
            this.router.navigate(['admin/dashboard']);
          }
        },
      });
  }

  cancelarSincronizacao() {
    this.setPermissaoOperacoes(false);
    this.iniciarProgresso();
    this.limparTabela();

    (this.baseService as any)
      .cancelar(this.endpoint, this.baseSelecionada)
      .subscribe({
        next: (resposta: any) => {
          // Swal.fire({
          //   icon: 'warning',
          //   title: 'Cancelamento',
          //   text: 'Operação cancelada pelo usuário.',
          //   confirmButtonText: 'OK',
          // });
        },
      });
  }
}
