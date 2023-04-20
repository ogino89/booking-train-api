import { UserModel } from '../../../domain/user/model/user.model';
export interface TypeResponseGetToken {
  accessToken: string;
  refreshToken: string;
}

export interface AuthRepositoryInterface {
  findByEmail(email: string): Promise<UserModel | unknown>;
  findOne(id: string): Promise<UserModel | unknown>;
  getTokens(id: string, email: string): Promise<TypeResponseGetToken>;
  updateRefreshToken(id: string, refreshToken: string): void;
  register(user: UserModel): Promise<UserModel | unknown>;
  logout(id: string): Promise<UserModel | unknown>;
}
