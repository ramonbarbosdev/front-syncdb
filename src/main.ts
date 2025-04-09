/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { TokenInterceptor } from './app/auth/token-interceptor.interceptor';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';


bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient( withInterceptors([TokenInterceptor])),
    provideRouter(routes),
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    ...appConfig.providers
  ]
}).catch(err => console.error(err));