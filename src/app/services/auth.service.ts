import { User } from './../auth/models/user.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { throwError, Subject } from 'rxjs';
import { SignUpEndpoint, SignInEndpoint } from '../secrets/db-endpoints-store.js';

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

  userSubject = new Subject<User>();

  constructor(private http: HttpClient) { }

  signUp(email: string, password: string) {
    return this.http.post<AuthResponseData>(SignUpEndpoint, {
      email,
      password,
      returnSecureToken: true // Whether or not to return an ID and refresh token. Should always be true.
    }).pipe(
      catchError(this.handleError),
      tap(responseData => {
        this.handleAuthentication(responseData.email, responseData.localId, responseData.idToken, +responseData.expiresIn);
      }));
  }

  logIn(email: string, password: string) {
    return this.http.post<AuthResponseData>(SignInEndpoint, {
      email,
      password,
      returnSecureToken: true
    }).pipe(
      catchError(this.handleError),
      tap(responseData => {
        this.handleAuthentication(responseData.email, responseData.localId, responseData.idToken, +responseData.expiresIn);
      }));
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
        default:
          break;
      }
    }

    return throwError(errorMessage);
  }

  private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);

    this.userSubject.next(user);
  }
}
