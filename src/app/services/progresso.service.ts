// progresso.service.ts
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { WebsocketService } from './websocket.service';

@Injectable({ providedIn: 'root' })
export class ProgressoService {
  private progressoSubject = new BehaviorSubject<number>(0);
  progresso$ = this.progressoSubject.asObservable();

  status = '...';
  emProgresso = false;

  private ws = inject(WebsocketService);

  constructor() {
    this.ws.progresso$.subscribe((valor) => {
      this.progressoSubject.next(valor);
      this.emProgresso = valor > 0 && valor < 100; // Atualiza automaticamente
    });
  }

  set progresso(valor: number) {
    this.progressoSubject.next(valor);
  }

  get progresso(): number {
    return this.progressoSubject.getValue();
  }

}
