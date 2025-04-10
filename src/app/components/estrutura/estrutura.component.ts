import { Component, inject, OnInit } from '@angular/core';
import { SelectComponent } from '../component/select/select.component';
import { EstruturaService } from '../../services/estrutura.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { WebsocketService } from '../../services/websocket.service';

@Component({
  selector: 'app-estrutura',
  imports: [ CommonModule, FormsModule],
  templateUrl: './estrutura.component.html',
  styleUrl: './estrutura.component.scss'
})
export class EstruturaComponent 
{

  
  serviceEstrutura =  inject(EstruturaService);

  bases: any[] = [];
  baseSelecionada!: string;

  constructor()
  {
    this.carregarBases();
  }
  

  carregarBases()
  {
    this.serviceEstrutura.buscarBaseExistente().subscribe
    ({
      next: (item) => {
        this.bases = item.map((base: any) => ({
          nm_base: base,  // Nome da base
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

    this.serviceEstrutura.verificarEstrutura(this.baseSelecionada).subscribe
    ({
      next: (item) => {
        console.log(item)

      },
      error: (e: any) => {
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
