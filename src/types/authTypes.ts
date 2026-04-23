export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
}

export interface AuthContextType {
  user: User | null
  login: (responnse: User, token: string, refreshToken: string) => Promise<void>
  logout: () => void
}