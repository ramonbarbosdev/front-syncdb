import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-table-basic',
  imports: [CommonModule],
  templateUrl: './table-basic.component.html',
  styleUrl: './table-basic.component.scss'
})
export class TableBasicComponent {

  @Input() resultados: any[] = []; 

  get colunas() {
    return this.resultados.length > 0 ? Object.keys(this.resultados[0]) : [];
  }
}
