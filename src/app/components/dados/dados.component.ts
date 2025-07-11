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
import { SelectSearchComponent } from '../component/select-search/select-search.component';
import { BrnCommandImports } from '@spartan-ng/brain/command';
import { HlmCardImports } from '@spartan-ng/helm/card';

@Component({
  selector: 'app-dados',
  imports: [
    RouterModule,
    ButtonComponent,
    CommonModule,
    TableBasicComponent,
    ProgressoBarComponent,
    HeaderComponent,
    SelectSearchComponent,
    BrnCommandImports,
    HlmCardImports,
  ],
  templateUrl: './dados.component.html',
  styleUrl: './dados.component.scss',
})
export class DadosComponent extends EstruturaDadosComponent<DadosService> {
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
  protected override get endpoint(): string {
    return 'dados';
  }
}
