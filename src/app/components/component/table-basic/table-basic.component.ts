import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-table-basic',
  imports: [CommonModule],
  templateUrl: './table-basic.component.html',
  styleUrl: './table-basic.component.scss'
})
export class TableBasicComponent {

  @Input() resultados: any[] = []; 
  @Input() colunasVisiveis: { [key: string]: boolean } = {};

  get colunas() {
    return this.resultados.length > 0 ? Object.keys(this.resultados[0]) : [];
  }

  mostrarErro(resultado: any): void {
    Swal.fire({
                icon: 'error',
                title: `${resultado.tabela}`,
                text: `${resultado.erro}`,
                confirmButtonText: 'Fechar',
                // width: 700
              });
  }
}
