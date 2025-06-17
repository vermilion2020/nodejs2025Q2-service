export class User {
  id: string;
  login: string;
  password: string;
  version: number;
  createdAt: number;
  updatedAt: number;
}

export type UserData = Pick<User, 'id' | 'login' | 'version'> & {
  createdAt: Date;
  updatedAt: Date;
};
