export class UserModel {
  id?: string;
  name: string;
  email: string;
  password: string;
  refreshToken?: string;

  constructor(
    name: string,
    email: string,
    password: string,
    id?: string,
    refreshToken?: string,
  ) {
    this.id = id ?? null;
    this.name = name;
    this.email = email;
    this.password = password;
    this.refreshToken = refreshToken;
  }
}
