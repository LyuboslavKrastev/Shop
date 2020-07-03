import { HttpClient } from '@angular/common/http';
import { Actions, ofType, Effect } from '@ngrx/effects'; // An observable that gives access to all dispatched actions
import * as AuthActions from './auth.actions';
import { switchMap, catchError, map } from 'rxjs/operators';
import { SignInEndpoint } from '../../secrets/db-endpoints-store.js';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToekn: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable()
export class AuthEffects {

  constructor(private actions$: Actions, private http: HttpClient) { }

  @Effect()
  authLogin = this.actions$
    .pipe(
      // for which types of effects to continue
      ofType(AuthActions.LOGIN_START),
      // create a new observable by taking another observable's data
      switchMap((authData: AuthActions.LoginStart) => {
        return this.http.post<AuthResponseData>(SignInEndpoint, {
          email: authData.payload.email,
          password: authData.payload.password,
          returnSecureToken: true,
        }).pipe(
          map(resData => {
            const expirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);

            return of(
              new AuthActions.Login({
                email: resData.email,
                userId: resData.localId,
                token: resData.idToken,
                expirationDate
              })
            );
          }),
          catchError(error => {// catch here in order to make sure that the overall stream does not die
            // should return a non-error observable

            // return a new observable without error
            return of();
          })
        );
      })
    );
}
