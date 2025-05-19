import { inject, Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { exibirErro } from '../utils/swalMensagem.utils';

@Injectable({
  providedIn: 'root',
})
export class BaseService {
  http = inject(HttpClient);

  private readonly API = `${environment.apiUrl}`;
  private readonly APISync = `${environment.apiUrl}/sincronizacao`;

  constructor() {}

  private webSocketService = inject(WebsocketService);

  private verificarConexaoWebSocket(): void {
    if (!this.webSocketService.getConnected()) this.webSocketService.connect();
  }

  buscarBaseExistente(): Observable<any> {
    this.verificarConexaoWebSocket();

    const url = `${this.APISync}/bases/`;

    return this.http.get<any>(url).pipe(
      tap((res) => {
        return res;
      }),
      catchError((e) => {
        exibirErro('', e);
        return throwError(() => e);
      })
    );
  }
  buscarEsquemaExistente(base: string): Observable<any> {
    this.verificarConexaoWebSocket();
    const url = `${this.APISync}/base/esquema/${base}`;

    return this.http.get<any>(url).pipe(
      tap((res) => {
        return res;
      }),
      catchError((e) => {
        exibirErro('', e);
        return throwError(() => e);
      })
    );
  }
  buscarTabelaExistente(base: string, esquema: string): Observable<any> {
    this.verificarConexaoWebSocket();
    const url = `${this.APISync}/base/tabela/${base}/${esquema}`;

    return this.http.get<any>(url).pipe(
      tap((res) => {
        return res;
      }),
      catchError((e) => {
        exibirErro('', e);
        return throwError(() => e);
      })
    );
  }

  verificarExistenciaEsquema( base: string, esquema: string) {
    this.verificarConexaoWebSocket();
    const url = `${this.APISync}/verificaesquema/${base}/${esquema}`;

    return this.http.get<any>(url).pipe(
      tap((res) => {
        return res;
      }),
      catchError((e) => {
        exibirErro('', e);
        return throwError(() => e);
      })
    );
  }

  //**------------------ */
  verificar(
    endpoint: string,
    item: any,
    esquema: string,
    tabela: string
  ): Observable<any> {
    this.verificarConexaoWebSocket();

    const url = `${this.API}/${endpoint}/verificar/${item}/${esquema}/${tabela}`;

    return this.http.get<any>(url).pipe(
      tap((res) => {
        return res;
      }),
      catchError((e) => {
        exibirErro('', e);
        return throwError(() => e);
      })
    );
  }

  sincronizacao(endpoint: string, item: any): Observable<any> {
    this.verificarConexaoWebSocket();

    const url = `${this.API}/${endpoint}/${item}`;

    return this.http.get<any>(url).pipe(
      tap((res) => {
        return res;
      }),
      catchError((e) => {
        exibirErro('', e);
        return throwError(() => e);
      })
    );
  }

  cancelar(endpoint: string): Observable<any> {
    this.verificarConexaoWebSocket();

    const url = `${this.API}/${endpoint}/cancelar`;

    return this.http.get<any>(url).pipe(
      tap((res) => {
        return res;
      }),
      catchError((e) => {
        exibirErro("", e);
        return throwError(() => e);
      })
    );
  }
}
