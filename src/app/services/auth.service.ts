import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SignUpEndpoint } from '../secrets/db-endpoints-store.js';

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
    });
  }
}
