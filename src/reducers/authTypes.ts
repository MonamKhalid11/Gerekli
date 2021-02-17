export interface authState {
  token: string;
  ttl: number;
  logged: boolean;
  uuid: null;
  fetching: boolean;
  error: null;
  errorStatus: null;
  deviceToken: null;
  profile_id: string;
  user_id: number;
}
