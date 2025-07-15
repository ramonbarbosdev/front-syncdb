import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { WebsocketService } from './websocket.service';
import { catchError, Observable, tap, throwError } from 'rxjs';
import Swal from 'sweetalert2';

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

  getConexao(idUsuario:string): Observable<any> {
    this.verificarConexaoWebSocket();
    const url = `${this.API}/${idUsuario}`;
    return this.http
      .get(url)
      .pipe(catchError((error) => throwError(() => error)));
  }

  atualizarConexao(data: any) {

    const url = `${this.API}/`;

    return this.http.put<any>(url, data).pipe(
      tap((res) => {
             Swal.fire({
               icon: 'success',
               title: 'Sucesso!',
               text: 'Conexões atualizadas com sucesso.',
               confirmButtonText: 'OK',
             });
        return res;
      }),
      catchError((e) => {
        Swal.fire({
          icon: 'error',
          title: 'Erro ao atualizar',
          text: 'Verifique os dados de conexão.',
          confirmButtonText: 'OK',
        });
        return throwError(() => e);
      })
    );
  }

 
}
