import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { WebsocketService } from '../services/websocket.service';
import { environment } from '../environments/environment';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}`;

  private router = inject(Router);
  constructor(private http: HttpClient) {}

  login(credenciais: { login: string; senha: string }) {
    return this.http.post(`${this.apiUrl}/auth/login`, credenciais, {
      withCredentials: true, // <- permite receber e enviar cookies
    });
  }

  cadastrar(data: any): Observable<any> {
    const url = `${this.apiUrl}/auth/register`;

    return this.http
      .post(url, data)
      .pipe(catchError((error) => throwError(() => error)));
  }

  fazerLogout() {
    return this.http.post(
      `${this.apiUrl}/auth/logout`,
      {},
      {
        headers: this.getHeaders(),
      }
    );
  }

  logout() {
    this.fazerLogout().subscribe({
      next: (res) => {
        console.log( res);
        this.clearToken();
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Erro no logout:', err);
        this.clearToken();
        this.router.navigate(['/login']);
      },
    });
  }

  setToken(token: string) {
    sessionStorage.setItem('token', token);
  }

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  clearToken() {
    sessionStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getHeaders() {
    const token = this.getToken();
    return new HttpHeaders({
      Authorization: `${token}`,
    });
  }
}
