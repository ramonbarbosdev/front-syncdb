import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventConexaoService {

  private reloadSubject = new Subject<void>();
  reload$ = this.reloadSubject.asObservable();

  emitReload() {
    this.reloadSubject.next();
  }
  
}
