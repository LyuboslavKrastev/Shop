import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Actions, ofType, Effect } from '@ngrx/effects'; // An observable that gives access to all dispatched actions
import * as AuthActions from './auth.actions';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
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

const handleAuthentication = (expiresIn: number, email: string, userId: string, token: string) => {
  const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);

  return new AuthActions.AuthenticateSuccess({
    email,
    userId,
    token,
    expirationDate
  });
};

const handleError = (errorResponse: any) => {
  let errorMessage = 'An unknown error has occurred.';

  if (errorResponse.error && errorResponse.error.error) {
    switch (errorResponse.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'The provided email address is already taken.';
        break;
      case 'INVALID_EMAIL':
        errorMessage = 'The provided email address is invalid.';
        break;
      case 'INVALID_PASSWORD':
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'Invalid email or password.';
        break;
      case 'TOO_MANY_ATTEMPTS_TRY_LATER : Too many unsuccessful login attempts. Please try again later.':
        errorMessage =
          'Too many unsuccessful login attempts.Please try again later.';
        break;
      default:
        break;
    }
  }
  // return a new observable without error
  return of(new AuthActions.AuthenticateFail(errorMessage));
};

@Injectable()
export class AuthEffects {
  constructor(private actions$: Actions, private http: HttpClient, private router: Router) { }

  // dispatch: false => the effect will not yield a dispatchable action at the end
  @Effect({ dispatch: false })
  authSuccess = this.actions$.pipe(ofType(AuthActions.AUTHENTICATE_SUCCESS), tap(() => {
    this.router.navigate(['/']);
  }));

  @Effect()
  authSignup = this.actions$.pipe(
    ofType(AuthActions.SIGNUP_START),
    switchMap((signupaAction: AuthActions.SignupStart) => {
      return this.http
        .post<AuthResponseData>(SignInEndpoint, {
          email: signupaAction.payload.email,
          password: signupaAction.payload.password,
          returnSecureToken: true,
        }).pipe(
          // map automatically wraps into observable
          map(resData => {
            const expirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);

            return new AuthActions.AuthenticateSuccess({
              email: resData.email,
              userId: resData.localId,
              token: resData.idToken,
              expirationDate
            });
          }),
          catchError(errorResponse => {// catch here in order to make sure that the overall stream does not die
            // should return a non-error observable
            return handleError(errorResponse);
          })
        );
    })
  );

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
          // map automatically wraps into observable
          map(resData => {
            return handleAuthentication(+resData.expiresIn, resData.email, resData.localId, resData.idToken);
          }),
          catchError(errorResponse => {// catch here in order to make sure that the overall stream does not die
            // should return a non-error observable
            return handleError(errorResponse);
          })
        );
      })
    );
}
