import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { EstruturaService } from '../../services/estrutura.service';

import { ButtonComponent } from '../component/button/button.component';
import { ProgressoBarComponent } from '../component/progresso-bar/progresso-bar.component';
import { TableBasicComponent } from '../component/table-basic/table-basic.component';

import { Router, RouterModule } from '@angular/router';
import { EstruturaDadosComponent } from '../estrutura-dados/estrutura-dados.component';
import { HeaderComponent } from "../component/header/header.component";
import { SelectSearchComponent } from "../component/select-search/select-search.component";

import { BrnCommandImports } from '@spartan-ng/brain/command';
import { HlmCardImports } from '@spartan-ng/helm/card';

@Component({
  selector: 'app-estrutura',
  imports: [
    CommonModule,
    FormsModule,
    ButtonComponent,
    ProgressoBarComponent,
    TableBasicComponent,
    RouterModule,
    HeaderComponent,
    SelectSearchComponent,
    BrnCommandImports,
    HlmCardImports,
    HeaderComponent,
  ],
  templateUrl: './estrutura.component.html',
  styleUrl: './estrutura.component.scss',
})
export class EstruturaComponent extends EstruturaDadosComponent<EstruturaService> {
  constructor() {
    super(inject(EstruturaService));
  }

  colunasVisiveis = {
    tabela: true,
    acao: true,
    querys: true,
    erro: false,
  };

  ds_operacao = 'Estrutura';
  protected override get endpoint(): string {
    return 'estrutura';
  }
}
