import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstruturaService
{

  http = inject(HttpClient);

  API = 'http://localhost:8080/syncdb/sincronizacao/estrutura';


  constructor() { }

  
  buscarBaseExistente(): Observable<any>
  {
    const url = `${this.API}/bases/`;
    
    return this.http.get<any[]>(url).pipe(
      catchError(error => throwError(() => error))
    );
  }
  verificarEstrutura(item: any): Observable<any>
  {
    const url = `${this.API}/verificar/${item}`;
    
    return this.http.get<any[]>(url).pipe(
      catchError(error => throwError(() => error))
    );
  }

}
