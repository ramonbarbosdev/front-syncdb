import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EstruturaCacheService {

  private tabelasTemporarias: any[] = [];

  setTabelas(dados: any[]): void {
    this.tabelasTemporarias = dados;
  }

  getTabelas(): any[] {
    return this.tabelasTemporarias;
  }

  limpar(): void {
    this.tabelasTemporarias = [];
  }

  hasCache(): boolean {
    return this.tabelasTemporarias.length > 0;
  }
}
