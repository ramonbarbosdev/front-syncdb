import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';
import { EventConexaoService } from '../../../services/event-conexao.service';
import { HlmSpinnerComponent } from '@spartan-ng/helm/spinner';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideUpload } from '@ng-icons/lucide';
import { HlmIconDirective } from '@spartan-ng/helm/icon';


@Component({
  selector: 'app-upload-certificado',
  imports: [CommonModule, HlmSpinnerComponent, HlmIconDirective, NgIcon],
  providers: [provideIcons({ lucideUpload })],
  templateUrl: './upload-certificado.component.html',
  styleUrl: './upload-certificado.component.scss',
})
export class UploadCertificadoComponent {
  @Input() id_conexao!: number;

  @Input() arquivoValido: boolean = false;
  @Output() arquivoValidoChange = new EventEmitter<boolean>(); // <- necessário para two-way binding

  private readonly APISync = `${environment.apiUrl}/conexao`;
  private eventService = inject(EventConexaoService);

  mensagem: string = '';
  carregando: boolean = false;

  constructor(private http: HttpClient) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    const formData = new FormData();
    formData.append('arquivo', file);

    this.carregando = true;

    setTimeout(() => {
      this.http
        .post(
          `${this.APISync}/certificado/upload/${this.id_conexao}`,
          formData,
          {
            responseType: 'text',
          }
        )
        .subscribe({
          next: (res) => {
            this.mensagem = `${res}`;
            this.carregando = false;
            this.arquivoValidoChange.emit(true);
            this.eventService.emitReload();
          },
          error: (err) => {
            this.mensagem = `Erro: ${err.error || err.message}`;
            this.carregando = false;
            this.arquivoValidoChange.emit(false);
          },
        });
    }, 1500);
  }
}
