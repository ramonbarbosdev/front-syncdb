import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-button',
  imports: [CommonModule, FormsModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  @Input() text: string = 'Clique aqui';
  @Input() type: string = '';
  @Input() icon: string = '';  
  @Input() color: string = '#4da6ff'; 
  @Input() backgroundColor: string = '#ffffff';  
  @Input() disabled: boolean = false;
  @Output() clickEvent = new EventEmitter<void>();

  onClick() {
    if (!this.disabled) {
      this.clickEvent.emit();
    }
  }
}
