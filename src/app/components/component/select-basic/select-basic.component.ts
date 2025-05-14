import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-select-basic',
  imports: [FormsModule, CommonModule],
  templateUrl: './select-basic.component.html',
  styleUrl: './select-basic.component.scss'
})
export class SelectBasicComponent {
  @Input() label!: string;
  @Input() options: any[] = [];
  @Input() selected: string = '';
  @Output() selectedChange = new EventEmitter<string>();


  onChange(value: string) {
    this.selectedChange.emit(value);
  }


}
