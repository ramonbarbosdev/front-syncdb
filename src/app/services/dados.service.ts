import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DadosService {
  http = inject(HttpClient);

  private readonly API = `${environment.apiUrl}/dados`;
  private readonly APISync = `${environment.apiUrl}/sincronizacao`;

  constructor() {}

  private webSocketService = inject(WebsocketService);

  private verificarConexaoWebSocket(): void {
    if (!this.webSocketService.getConnected()) this.webSocketService.connect();
  }

  buscarBaseExistente(): Observable<any> {
    this.verificarConexaoWebSocket();
    const url = `${this.APISync}/bases/`;

    return this.http
      .get<any[]>(url)
      .pipe(catchError((error) => throwError(() => error)));
  }
  buscarEsquemaExistente(base: string): Observable<any> {
    this.verificarConexaoWebSocket();
    const url = `${this.APISync}/base/esquema/${base}`;

    return this.http
      .get<any[]>(url)
      .pipe(catchError((error) => throwError(() => error)));
  }
  buscarTabelaExistente(base: string, esquema: string): Observable<any> {
    this.verificarConexaoWebSocket();
    const url = `${this.APISync}/base/tabela/${base}/${esquema}`;

    return this.http
      .get<any[]>(url)
      .pipe(catchError((error) => throwError(() => error)));
  }

  verificarExistenciaEsquema(base: string, esquema: string) {
    this.verificarConexaoWebSocket();
    const url = `${this.APISync}/verificaesquema/${base}/${esquema}`;

    return this.http
      .get<any[]>(url)
      .pipe(catchError((error) => throwError(() => error)));
  }

  //**------------------ */
  verificar(item: any, esquema: string, tabela: string): Observable<any> {
    this.verificarConexaoWebSocket();

    const url = `${this.API}/verificar/${item}/${esquema}/${tabela}`;

    return this.http
      .get<any[]>(url)
      .pipe(catchError((error) => throwError(() => error)));
  }

  sincronizacao(item: any): Observable<any> {
    this.verificarConexaoWebSocket();

    const url = `${this.API}/${item}`;

    return this.http
      .get<any[]>(url)
      .pipe(catchError((error) => throwError(() => error)));
  }

  cancelar(): Observable<any>
  {
    this.verificarConexaoWebSocket();

    // const url = `${environment.apiUrl}/processo/cancelar/${base}`;
    const url = `${this.API}/cancelar`;

    return this.http
      .get<any[]>(url)
      .pipe(catchError((error) => throwError(() => error)));
  }
}
