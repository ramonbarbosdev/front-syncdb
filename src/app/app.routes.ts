import { Routes } from '@angular/router';
import { LoginComponent } from './components/layout/login/login.component';
import { PrincipalComponent } from './components/layout/principal/principal.component';
import { authGuard } from './auth/auth.guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EstruturaComponent } from './components/estrutura/estrutura.component';
import { DadosComponent } from './components/dados/dados.component';
import { ConexaoComponent } from './components/conexao/conexao.component';

export const routes: Routes = [
    {path: '', redirectTo: 'login', pathMatch: 'full'},
    {path: 'login', component: LoginComponent},
    {path: 'admin', component: PrincipalComponent, canActivateChild: [authGuard], children:
        [
            {path: 'dashboard', component: DashboardComponent},
            {path: 'estrutura', component: EstruturaComponent},
            {path: 'dados', component: DadosComponent},
            {path: 'conexao', component: ConexaoComponent},
            
        ]
    },
];
