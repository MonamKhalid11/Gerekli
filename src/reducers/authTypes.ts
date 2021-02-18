export interface authState {
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

export interface authLoginRequestAction {
  type: string;
  payload: authState;
}
