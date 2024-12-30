export interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  profile_photo_path: string;
}

export interface RegisterBody {
  username: string;
  name: string;
  email: string;
  password: string;
}
