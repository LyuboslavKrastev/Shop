import { User } from './../models/user.model';

export interface State {
  user: User;
}


const initialState = {
  user: null
};

export function authReducer(state = initialState, action) {
  return state;
}
