import {
  AUTH_LOGIN_REQUEST,
  AUTH_LOGIN_FAIL,
  AUTH_LOGOUT,
  AUTH_REGESTRATION_SUCCESS,
  REGISTER_DEVICE_SUCCESS,
  RESTORE_STATE,
} from '../constants';

export interface AuthState {
  token: string;
  ttl: number;
  logged: boolean;
  uuid: string;
  fetching: boolean;
  error: string;
  errorStatus: number;
  deviceToken: string;
  profile_id: string;
  user_id: number;
}

// AUTH_LOGIN_REQUEST
interface AuthLoginRequestAction {
  type: typeof AUTH_LOGIN_REQUEST;
}

// AUTH_REGESTRATION_SUCCESS
interface AuthRegistrationSuccessPayload {
  token: string;
  ttl: number;
}

interface AuthRegistrationSuccessAction {
  type: typeof AUTH_REGESTRATION_SUCCESS;
  payload: AuthRegistrationSuccessPayload;
}

// AUTH_LOGIN_FAIL
interface AuthLoginFailPayload {
  message: string;
  status: number;
}

interface AuthLoginFailAction {
  type: typeof AUTH_LOGIN_FAIL;
  payload: AuthLoginFailPayload;
}

// REGISTER_DEVICE_SUCCESS
interface RegisterDeviceSuccessPayload {
  token: string;
}

interface RegisterDeviceSuccessAction {
  type: typeof REGISTER_DEVICE_SUCCESS;
  payload: RegisterDeviceSuccessPayload;
}

// AUTH_LOGOUT
interface AuthLogoutAction {
  type: typeof AUTH_LOGOUT;
}

// RESTORE_STATE
interface RestoreStatePayload {
  auth: {
    uuid: string;
  };
}

interface RestoreStateAction {
  type: typeof RESTORE_STATE;
  payload: RestoreStatePayload;
}

export type AuthActionTypes =
  | AuthLoginRequestAction
  | AuthLoginFailAction
  | AuthLogoutAction
  | AuthRegistrationSuccessAction
  | RegisterDeviceSuccessAction
  | RestoreStateAction;
