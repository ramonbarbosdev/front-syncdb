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
    console.log(this.baseSelecionada);
    this.progressoService.progresso = 0 
    this.progressoService.mensagem = '' 
    
    if(this.baseSelecionada)
    {
      this.fl_operacao = true;

      this.serviceEstrutura.verificarEstrutura(this.baseSelecionada).subscribe
      ({
        next: (item) => {
          console.log(item)
          this.fl_operacao = false;

          this.resultados = [
            { campo1: 'Resultado 1', campo2: 'Valor 1', campo3: 'Outro valor' },
            { campo1: 'Resultado 2', campo2: 'Valor 2', campo3: 'Outro valor 2' },
            { campo1: 'Resultado 3', campo2: 'Valor 3', campo3: 'Outro valor 3' }
          ];
  
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
