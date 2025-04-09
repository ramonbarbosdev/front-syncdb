import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-input-password',
  imports: [],
  templateUrl: './input-password.component.html',
  styleUrl: './input-password.component.scss'
})
export class InputPasswordComponent
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
