import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { User } from './../auth/models/user.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import {
  SignUpEndpoint,
  SignInEndpoint,
} from '../secrets/db-endpoints-store.js';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToekn: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenExpirationTimer: any;
  // userSubject = new BehaviorSubject<User>(null);
  token: string = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private store: Store<fromApp.AppState>) { }

  signUp(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(SignUpEndpoint, {
        email,
        password,
        returnSecureToken: true, // Whether or not to return an ID and refresh token. Should always be true.
      })
      .pipe(
        catchError(this.handleError),
        tap((responseData) => {
          this.handleAuthentication(
            responseData.email,
            responseData.localId,
            responseData.idToken,
            +responseData.expiresIn
          );
        })
      );
  }

  logIn(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(SignInEndpoint, {
        email,
        password,
        returnSecureToken: true,
      })
      .pipe(
        catchError(this.handleError),
        tap((responseData) => {
          this.handleAuthentication(
            responseData.email,
            responseData.localId,
            responseData.idToken,
            +responseData.expiresIn
          );
        })
      );
  }

  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));

    if (!userData) {
      return;
    }
    const expirationDate = new Date(userData._tokenExpirationDate);
    const user = new User(
      userData.id,
      userData.email,
      userData._token,
      expirationDate
    );

    if (user.token) {
      // this.userSubject.next(user);
      this.store
        .dispatch(
          new AuthActions.AuthenticateSuccess({ email: user.email, userId: user.id, token: user.token, expirationDate })
        );
      const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime(); // in ms
      this.autoLogout(expirationDuration);
    }
  }

  // May need to call this method in places other than just the header component, therefore the navigation will be handled here
  logout() {
    // this.userSubject.next(null);
    this.store.dispatch(new AuthActions.Logout());
    this.router.navigate(['./auth']);
    localStorage.removeItem('userData');

    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    console.log(expirationDuration);
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private handleError(errorResponse: HttpErrorResponse) {
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

    return throwError(errorMessage);
  }

  private handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);

    this.store.dispatch(new AuthActions.AuthenticateSuccess({ email, userId, token, expirationDate }));
    this.autoLogout(expiresIn * 1000); // in ms

    localStorage.setItem('userData', JSON.stringify(user));
  }
}
