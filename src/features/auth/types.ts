export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterUserData extends AuthCredentials {
  name: string;
}

export interface ForgotPasswordData {
  email: string;
}

