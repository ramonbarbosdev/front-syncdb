import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { WebsocketService } from './websocket.service';

@Injectable({
  providedIn: 'root'
})
export class EstruturaService
{

  http = inject(HttpClient);

  API = 'http://localhost:8080/syncdb/estrutura';

  constructor() { }

  private webSocketService = inject(WebsocketService);

  
  private verificarConexaoWebSocket(): void
  {
    if (!this.webSocketService.getConnected()) this.webSocketService.connect();
  }
  
  buscarBaseExistente(): Observable<any>
  {
    this.verificarConexaoWebSocket();
    const url = `${this.API}/bases/`;
    
    return this.http.get<any[]>(url).pipe(
      catchError(error => throwError(() => error))
    );
  }
  verificarEstrutura(item: any): Observable<any>
  {
    this.verificarConexaoWebSocket();

    const url = `${this.API}/verificar/${item}`;
    
    return this.http.get<any[]>(url).pipe(
      catchError(error => throwError(() => error))
    );
  }

  sincronizacaoEstrutura(item: any): Observable<any>
  {
    this.verificarConexaoWebSocket();

    const url = `${this.API}/${item}`;
    
    return this.http.get<any[]>(url).pipe(
      catchError(error => throwError(() => error))
    );
  }

}
