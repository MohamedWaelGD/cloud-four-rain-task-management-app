import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { Auth, authState } from '@angular/fire/auth';
import { map } from 'rxjs';

export const authenticatedGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const auth = inject(Auth);

  const user = await firstValueFrom(authState(auth).pipe(
    map(user => {
      if (!user) {
        router.navigate(['/auth/login']);
        return false;
      }
      return true;
    })
  ));

  return user;
};
