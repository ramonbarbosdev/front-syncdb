import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const auth = inject(AuthService);
  const user = auth.getUserSubbject();

  if (!user?.login) {
    router.navigate(['/auth/login']);
    return false;
  }

  return true;
};
