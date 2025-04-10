import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const auth = inject(AuthService);
  const token = auth.getToken();
  
  if (!token)
  {
   
    router.navigate(['/login']);
    return false;
  }

  return true;
};