import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { WebsocketService } from './websocket.service';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConexaoService {

  http = inject(HttpClient);

  private readonly API =  `${environment.apiUrl}/conexao`;
  constructor() { }

  private webSocketService = inject(WebsocketService);

  private verificarConexaoWebSocket(): void
  {
    if (!this.webSocketService.getConnected()) this.webSocketService.connect();
  }

  salvarDadosConexao(item: any): Observable<any>
  {
    this.verificarConexaoWebSocket();

    const url = `${this.API}/`;

    return this.http.post(url, item).pipe(
      catchError(error => throwError(() => error))
    );
  }

  // obterDadosConexao(): Observable<any>
  // {
  //   this.verificarConexaoWebSocket();

  //   const url = `${this.API}/${item}`;

  //   return this.http.get<any[]>(url).pipe(
  //     catchError(error => throwError(() => error))
  //   );
  // }
}
