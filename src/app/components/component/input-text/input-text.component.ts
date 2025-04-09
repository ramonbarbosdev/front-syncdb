import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-input-text',
  imports: [],
  templateUrl: './input-text.component.html',
  styleUrl: './input-text.component.scss'
})
export class InputTextComponent
{
  @Input() model: any;
  @Output() modelChange = new EventEmitter<any>();

  @Input() label!: string;
  @Input() inputId!: string;
  @Input() placeholder: string = '';
  @Input() required: boolean = false;

  onInputChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.modelChange.emit(value);
  }
}
