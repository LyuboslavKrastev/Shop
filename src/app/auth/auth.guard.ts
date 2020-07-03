import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { map, take } from 'rxjs/operators';
import { AuthService } from './../services/auth.service';
import { Observable } from 'rxjs';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  Router,
  UrlTree,
} from '@angular/router';
import * as fromApp from '../store/app.reducer';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private store: Store<fromApp.AppState>, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ):
    | boolean
    | UrlTree
    | Promise<boolean | UrlTree>
    | Observable<boolean | UrlTree> {
    return this.store.select('auth').pipe(
      take(1),
      map(authState => {
        return authState.user;
      }),
      map((user) => {
        const isAuthenticated = user ? true : false;
        if (isAuthenticated) {
          return true;
        }
        return this.router.createUrlTree(['/auth']);
      }),
    );
  }
}
