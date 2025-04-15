import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DadosService {

  
  http = inject(HttpClient);

  private readonly API =  `${environment.apiUrl}/dados`;

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

  verificar(item: any): Observable<any>
  {
    this.verificarConexaoWebSocket();

    const url = `${this.API}/verificar/${item}`;
    
    return this.http.get<any[]>(url).pipe(
      catchError(error => throwError(() => error))
    );
  }

  sincronizacao(item: any): Observable<any>
  {
    this.verificarConexaoWebSocket();

    const url = `${this.API}/${item}`;
    
    return this.http.get<any[]>(url).pipe(
      catchError(error => throwError(() => error))
    );
  }
  
}
