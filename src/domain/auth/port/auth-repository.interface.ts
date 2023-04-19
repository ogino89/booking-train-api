import { UserModel } from '../../../domain/user/model/user.model';

export interface AuthRepositoryInterface {
  findByEmail(email: string): Promise<UserModel | unknown>;
}
