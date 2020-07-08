import { AuthService } from './../../services/auth.service';
import { User } from './../models/user.model';
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

  const user = new User(email, userId, token, expirationDate);
  localStorage.setItem('userData', JSON.stringify(user));

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
  constructor(private actions$: Actions, private http: HttpClient, private router: Router, private authService: AuthService) { }

  // dispatch: false => the effect will not yield a dispatchable action at the end
  @Effect({ dispatch: false })
  authRedirect = this.actions$.pipe(
    ofType(AuthActions.AUTHENTICATE_SUCCESS),
    tap(() => {
      this.router.navigate(['/']);
    }));

  @Effect()
  autoLogin = this.actions$
    .pipe(
      ofType(AuthActions.AUTO_LOGIN),
      map(() => {
        const userData: {
          email: string;
          id: string;
          _token: string;
          _tokenExpirationDate: string;
        } = JSON.parse(localStorage.getItem('userData'));

        if (!userData) {
          return { type: 'NOTHING' };
        }
        const expirationDate = new Date(userData._tokenExpirationDate);
        const user = new User(
          userData.id,
          userData.email,
          userData._token,
          expirationDate
        );

        if (user.token) {

          const expirationDuration = new Date(userData._tokenExpirationDate).getTime() -
            new Date().getTime();

          this.authService.setLogoutTimer(expirationDuration);
          return new AuthActions.AuthenticateSuccess(
            {
              email: user.email,
              userId: user.id,
              token: user.token,
              expirationDate
            });
        }

        return { type: 'NOTHING' };
      })
    );

  @Effect({ dispatch: false })
  authLogout = this.actions$.pipe(
    ofType(AuthActions.LOGOUT),
    tap(() => {
      this.authService.clearLogoutTimer();
      localStorage.removeItem('userData');
      this.router.navigate(['/auth']);
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
          tap(resData => {
            this.authService.setLogoutTimer(+resData.expiresIn * 1000); // in ms
          }),
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
          tap(resData => {
            this.authService.setLogoutTimer(+resData.expiresIn * 1000); // in ms
          }),
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
