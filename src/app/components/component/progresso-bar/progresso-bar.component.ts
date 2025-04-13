import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-progresso-bar',
  imports: [],
  templateUrl: './progresso-bar.component.html',
  styleUrl: './progresso-bar.component.scss'
})
export class ProgressoBarComponent {
  @Input() progresso!: number; 
  @Input() mensagem: string = ''; 
}
