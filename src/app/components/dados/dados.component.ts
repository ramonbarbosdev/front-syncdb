import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SelectBasicComponent } from '../component/select-basic/select-basic.component';
import { ButtonComponent } from '../component/button/button.component';
import { DadosService } from '../../services/dados.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dados',
  imports: [RouterModule, ButtonComponent, CommonModule, SelectBasicComponent],
  templateUrl: './dados.component.html',
  styleUrl: './dados.component.scss'
})
export class DadosComponent {

  serviceDados = inject(DadosService);
  bases: { nm_base: string }[] = [];
  baseSelecionada = '';
  fl_operacaoVerificar = false;

  constructor()
  {
    this.inicializarComponente();
  }

  inicializarComponente(): void
  {
    this.carregarBases();
  }

  processarBaseDados()
  {
    this.inicializarComponente();
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

  private carregarBases(): void
  {
    this.serviceDados.buscarBaseExistente().subscribe({
      next: (bases) => {
        this.bases = bases.map((nm_base: string) => ({ nm_base }));
      },
      error: ({ error }) => this.exibirErro('Erro ao carregar as bases.', error)
    });
  }

  verificarDados()
  {
    if (!this.baseSelecionada)
    {
      return this.exibirErro('Erro ao verificar estrutura. Nenhuma base selecionada.', { code: 'Falha ao verificar' });
    }
  }
}
