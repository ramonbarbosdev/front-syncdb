import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SelectBasicComponent } from '../component/select-basic/select-basic.component';
import { ButtonComponent } from '../component/button/button.component';
import { DadosService } from '../../services/dados.service';
import { CommonModule } from '@angular/common';
import { TableBasicComponent } from '../component/table-basic/table-basic.component';
import { ProgressoBarComponent } from '../component/progresso-bar/progresso-bar.component';
import { EstruturaDadosComponent } from '../estrutura-dados/estrutura-dados.component';
import { HeaderComponent } from "../component/header/header.component";

@Component({
  selector: 'app-dados',
  imports: [RouterModule, ButtonComponent, CommonModule, SelectBasicComponent, TableBasicComponent, ProgressoBarComponent, HeaderComponent],
  templateUrl: './dados.component.html',
  styleUrl: './dados.component.scss'
})
export class DadosComponent extends EstruturaDadosComponent<DadosService>
{
  constructor() {
    super(inject(DadosService));
  }

  colunasVisiveis = {
    tabela: true,
    acao: true,
    querys: true,
    erro: false,
  };

  ds_operacao = 'Dados';
}
