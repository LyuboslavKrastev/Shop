import { Action } from '@ngrx/store';

// Named in compliance with https://ngrx.io/guide/store/actions in order to make sure that they do not interfere with other reducers
export const LOGIN = '[Auth] Login';
export const LOGOUT = '[Auth] Logout';
export const LOGIN_START = '[Auth] Login Start';
export class Login implements Action {
  readonly type = LOGIN;

  constructor(public payload: {
    email: string,
    userId: string,
    token: string,
    expirationDate: Date;
  }) { }
}

export class Logout implements Action {
  readonly type = LOGOUT;
}

export class LoginStart implements Action {
  readonly type = LOGIN_START;

  constructor(public payload: { email: string, password: string }) {

  }
}

export type AuthActions = Login | Logout;
