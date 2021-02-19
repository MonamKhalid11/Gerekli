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

interface PayloadAuth {
  uuid: number;
}

interface Payload {
  token: string;
  ttl: number;
  message: string;
  status: number;
  auth: PayloadAuth;
}

export interface AuthLoginRequestAction {
  type: string;
  payload: Payload;
}
