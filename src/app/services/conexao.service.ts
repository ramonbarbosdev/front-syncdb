import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { WebsocketService } from './websocket.service';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConexaoService {
  http = inject(HttpClient);

  private readonly API = `${environment.apiUrl}/conexao`;
  constructor() {}

  private webSocketService = inject(WebsocketService);

  private verificarConexaoWebSocket(): void {
    if (!this.webSocketService.getConnected()) this.webSocketService.connect();
  }

  criarConexao(item: any): Observable<any> {
    this.verificarConexaoWebSocket();

    const url = `${this.API}/`;

    return this.http
      .post(url, item)
      .pipe(catchError((error) => throwError(() => error)));
  }

  getConexao(): Observable<any> {
    this.verificarConexaoWebSocket();
    const url = `${this.API}/`;
    return this.http
      .get(url)
      .pipe(catchError((error) => throwError(() => error)));
  }

  atualizarConexao(payload: any) {
     const url = `${this.API}/`;

     return this.http
       .post(url, payload)
       .pipe(catchError((error) => throwError(() => error)));
  }
}
