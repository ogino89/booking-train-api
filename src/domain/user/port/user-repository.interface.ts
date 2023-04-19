import { UserModel } from '../model/user.model';

export interface UserRepositoryInterface {
  create(user: UserModel): Promise<UserModel | unknown>;
  findAll(): Promise<UserModel[] | unknown>;
  findOne(id: string): Promise<UserModel | unknown>;
  update(id: string, user: UserModel): Promise<UserModel | unknown>;
  findByEmail(email: string): Promise<UserModel | unknown>;
  delete(id: string): Promise<string>;
}
