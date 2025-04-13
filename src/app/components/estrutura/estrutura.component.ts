import { Component, inject, OnInit } from '@angular/core';
import { SelectComponent } from '../component/select/select.component';
import { EstruturaService } from '../../services/estrutura.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { WebsocketService } from '../../services/websocket.service';
import { HttpClient } from '@angular/common/http';
import { ProgressoService } from '../../services/progresso.service';
import { SelectBasicComponent } from '../component/select-basic/select-basic.component';
import { ButtonComponent } from "../component/button/button.component";
import { ProgressoBarComponent } from "../component/progresso-bar/progresso-bar.component";
import { TableBasicComponent } from "../component/table-basic/table-basic.component";

@Component({
  selector: 'app-estrutura',
  imports: [CommonModule, FormsModule, SelectBasicComponent, ButtonComponent, ButtonComponent, ProgressoBarComponent, TableBasicComponent],
  templateUrl: './estrutura.component.html',
  styleUrl: './estrutura.component.scss'
})
export class EstruturaComponent  
{

  serviceEstrutura =  inject(EstruturaService);
  progressoService =  inject(ProgressoService);
  bases: any[] = [];
  baseSelecionada!: string;
  fl_operacao: boolean = false;
  resultados: any[] = []; 

  constructor( )
  {
    this.carregarBases();
    this.progressoService.status = 'Verificação da estrutura'

  }


  carregarBases()
  {
    this.serviceEstrutura.buscarBaseExistente().subscribe
    ({
      next: (item) => {
        this.bases = item.map((base: any) => ({
          nm_base: base,  
        }));
      },
      error: (e: { error: { code: any; error: any; }; }) => {
        Swal.fire({
          icon: 'error',
          title: e.error.code,
          text: e.error.error || 'Erro ao salvar o objeto.',
          confirmButtonText: 'OK'
        });
      }
    });
  }

  verificarEstrutura()
  {
    this.progressoService.progresso = 0   
    this.progressoService.status = 'Verificação da estrutura'
    
    if(this.baseSelecionada)
    {
      this.fl_operacao = true;

      this.serviceEstrutura.verificarEstrutura(this.baseSelecionada).subscribe
      ({
        next: (item) => {
          this.fl_operacao = false;

          this.resultados = item.tabelas_afetadas.map((x: { tabela: any; acao: any; erro: any; querys: any; }) => ({
            tabela: x.tabela,
            acao: x.acao,
            querys: x.querys,
            erro: x.erro,
          }));
    
        },
        error: (e: any) => {
        this.fl_operacao = false;

          Swal.fire({
            icon: 'error',
            title: 'Erro ' +e.status,
            text: e.error.details || 'Erro ao salvar o objeto.',
            confirmButtonText: 'OK'
          });
        }
      });
    }

   
  }


}
