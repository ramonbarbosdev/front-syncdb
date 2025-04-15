// progresso.service.ts
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { WebsocketService } from './websocket.service';

@Injectable({ providedIn: 'root' })
export class ProgressoService {
  private progressoSubject = new BehaviorSubject<number>(0);
  progresso$ = this.progressoSubject.asObservable();

  status = '...';

  private ws = inject(WebsocketService);

  constructor() {
    // Quando o WebSocket emitir novo progresso, repassa para os inscritos
    this.ws.progresso$.subscribe((valor) => {
      this.progressoSubject.next(valor);
    });
  }

  set progresso(valor: number) {
    this.progressoSubject.next(valor);
  }

  get progresso(): number {
    return this.progressoSubject.getValue();
  }
}
