import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { TokenStorageService } from '../_services/token-storage.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const tokenStorageService = inject(TokenStorageService);
  const router = inject(Router);
  const token = tokenStorageService.getToken();
  if (token) {
    return true;
  } else {
    router.navigate(['login']);
    return false;
  }
};

// export const AuthGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
//   const loginService = inject(LoginService);
//   const router = inject(Router);

//   return loginService.isLoggedIn().pipe(
//     map(loggedIn => loggedIn ? true : router.createUrlTree([router.parseUrl(Constants.LOGIN_ROUTE)], {
//       queryParams: { loggedOut: true, origUrl: state.url }
//     } )),
//     catchError((err) => {
//       router.navigate([Constants.LOGIN_ROUTE], {
//         queryParams: { loggedOut: true, origUrl: state.url }
//       });
//       return of(false);
//     })
//   )
// }
