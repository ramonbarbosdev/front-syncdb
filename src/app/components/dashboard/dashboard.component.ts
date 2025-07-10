import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import {
  HlmCardContentDirective,
  HlmCardDescriptionDirective,
  HlmCardDirective,
  HlmCardFooterDirective,
  HlmCardHeaderDirective,
  HlmCardTitleDirective,
  HlmCardActionDirective,
} from '@spartan-ng/helm/card';

@Component({
  selector: 'app-dashboard',
  imports: [
    HlmCardContentDirective,
    HlmCardDescriptionDirective,
    HlmCardDirective,
    HlmCardFooterDirective,
    HlmCardHeaderDirective,
    HlmCardTitleDirective,
    HlmCardActionDirective,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  router = inject(Router);

  abrirEstrutura() {
    this.router.navigate(['admin/estrutura']);
  }
  abrirDados() {
    this.router.navigate(['admin/dados']);
  }
}
