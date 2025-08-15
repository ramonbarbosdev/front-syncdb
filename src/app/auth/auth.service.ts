import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { WebsocketService } from '../services/websocket.service';
import { environment } from '../environments/environment';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}`;

  private router = inject(Router);

  private userSubject = new BehaviorSubject<any | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    const userJson = sessionStorage.getItem('user');
    if (userJson) {
      const user = JSON.parse(userJson);
      this.userSubject.next(user);
    }
  }

  login(credenciais: any): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/auth/login`, credenciais, { withCredentials: true })
      .pipe(
        tap((user) => {
          this.userSubject.next(user);
          sessionStorage.setItem('user', JSON.stringify(user));
        }),
        catchError((error) => throwError(() => error))
      );
  }

  cadastrar(data: any): Observable<any> {
    const url = `${this.apiUrl}/auth/register`;

    return this.http
      .post(url, data)
      .pipe(catchError((error) => throwError(() => error)));
  }

  logout() {
    this.http
      .post(`${this.apiUrl}/auth/logout`, {}, { withCredentials: true })
      .subscribe({
        next: () => {
          this.router.navigate(['/login']);
          this.userSubject.next(null);
          sessionStorage.removeItem('user');
        },
        error: () => {
          this.router.navigate(['/login']);
          this.userSubject.next(null);
          sessionStorage.removeItem('user');
        },
      });
  }

  getUser() {
    return this.userSubject.value;
  }

  getUserSubbject() {
    return this.userSubject.value;
  }
  isAuthenticated(): boolean {
    return !!this.userSubject.value;
  }
}
