import { Routes } from '@angular/router';
import { LoginComponent } from './components/layout/login/login.component';
import { PrincipalComponent } from './components/layout/principal/principal.component';
import { authGuard } from './auth/auth.guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EstruturaComponent } from './components/estrutura/estrutura.component';
import { WebSocketExampleComponent } from './components/WebSocketExampleComponent ';

export const routes: Routes = [
    {path: '', redirectTo: 'login', pathMatch: 'full'},
    {path: 'login', component: LoginComponent},
    {path: 'admin', component: PrincipalComponent, canActivateChild: [authGuard], children:
        [
            {path: 'dashboard', component: WebSocketExampleComponent},
            {path: 'estrutura', component: EstruturaComponent},
            
        ]
    },
];
