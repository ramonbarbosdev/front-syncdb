import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss'
})
export class SelectComponent 
{
  @Input() label!: string;
  @Input() inputId!: string;
  @Input() required: boolean = false;

  @Input() options: any[] = [];
  @Input() valueField: string = 'id';
  @Input() labelField: string = 'label';

  @Input() model: any;
  @Output() modelChange = new EventEmitter<any>();

  onChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.modelChange.emit(value);
  }
}
