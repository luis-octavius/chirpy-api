export interface UserRequest {
  email: string;
  password: string;
}

export interface UserResponse {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  isChirpyRed: false;
}
