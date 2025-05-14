import { CommonModule, Location } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProgressoService } from '../../../services/progresso.service';
import { exibirErro } from '../../../utils/swalMensagem.utils';

@Component({
  selector: 'app-header',
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Input() titulo: string | undefined;
  @Input() form: string | undefined;
  @Input() fl_list: boolean | undefined;

  router = inject(Router);
  location = inject(Location);
  progressoService = inject(ProgressoService);

  onClose()
  {
    if (this.progressoService.emProgresso) return exibirErro(`Ação bloqueada: há um progresso em andamento.`, null);

    if (this.fl_list) {
      this.router.navigate(['admin/dashboard']);
    } else {
      this.location.back();
    }
  }

  onNew() {
    this.router.navigate(['admin/' + this.form]);
  }
}
