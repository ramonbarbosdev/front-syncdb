import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HlmFormFieldModule } from '@spartan-ng/helm/form-field';
import { HlmInputDirective } from '@spartan-ng/helm/input';
import { HlmLabelDirective } from '@spartan-ng/helm/label';

@Component({
  selector: 'app-input-custom',
  imports: [
    HlmFormFieldModule,
    HlmLabelDirective,
    HlmInputDirective,
    CommonModule,
  ],
  templateUrl: './input-custom.component.html',
  styleUrl: './input-custom.component.scss',
})
export class InputCustomComponent {
  @Input() model: any;
  @Input() type: any;
  @Output() modelChange = new EventEmitter<any>();

  @Input() label!: string;
  @Input() inputId!: string;
  @Input() placeholder: string = '';
  @Input() required: boolean = false;

  onInputChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.modelChange.emit(value);
  }

  showPassword = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
