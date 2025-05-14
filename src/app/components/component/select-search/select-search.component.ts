import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-select-search',
  standalone: true,
  imports: [NgSelectModule, CommonModule, FormsModule],
  templateUrl: './select-search.component.html',
  styleUrl: './select-search.component.scss',
})
export class SelectSearchComponent {
  @Input() inputId!: string;
  @Input() label!: string;
  @Input() options: any[] = [];
  @Input() selected: string = '';
  @Output() selectedChange = new EventEmitter<string>();

  onChange(value: any) {
    this.selectedChange.emit(value.nm_option);
  }
}
