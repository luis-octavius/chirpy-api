export interface CreateChirpRequest {
  body: string;
}

export interface ChirpResponse {
  id: string;
  body: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetChirpsResponse {
  chirps: ChirpResponse[];
}
