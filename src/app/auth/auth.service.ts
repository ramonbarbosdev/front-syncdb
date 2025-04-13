import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService
{

  private apiUrl = 'http://localhost:8080/syncdb';

  private router = inject(Router);
  
  constructor(private http: HttpClient) { }

  login(credenciais: {login: string, senha: string}) {
    return this.http.post(`${this.apiUrl}/login`, credenciais, {
      withCredentials: true // <- permite receber e enviar cookies
    });
  }

  logout()
  {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  setToken(token: string)
  {
    localStorage.setItem('token', token);
  }

  getToken(): string | null
  {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean
  {
    return !!this.getToken();
  }

  getHeaders()
  {
    const token = this.getToken();
    return new HttpHeaders({
      Authorization: `${token}`
    });
  }
}