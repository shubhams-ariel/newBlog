
export interface User {
  _id: string;
  text: string;
  user: {
    username: string;
    email?: string;
  };
}

export interface LoginResponse {
  accessToken: string;
  role: string;
  user: {
    id: string;
    username: string;
    email: string;
    profilePic: string;
  };
}

export interface SignupResponse {
  accessToken: string;
  role: string;
  user: {
    id: string;
    username: string;
    email: string;
    profilePic: string;
  };
}
