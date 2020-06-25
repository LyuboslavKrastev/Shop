import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SignUpEndpoint } from '../secrets/db-endpoints-store.js';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToekn: string;
  expiresIn: string;
  localId: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) { }

  signUp(email: string, password: string) {

    return this.http.post<AuthResponseData>(SignUpEndpoint, {
      email,
      password,
      returnSecureToken: true // Whether or not to return an ID and refresh token. Should always be true.
    }).pipe(catchError(errorResponseData => {
      let errorMessage = 'An unknown error has occurred.';

      if (errorResponseData.error && errorResponseData.error.error) {
        switch (errorResponseData.error.error.message) {
          case 'EMAIL_EXISTS':
            errorMessage = 'The provided email address is already taken.';
            break;
          case 'INVALID_EMAIL':
            errorMessage = 'The provided email address is invalid.';
            break;
          default:
            break;
        }
      }

      return throwError(errorMessage);
    }));
  }
}
