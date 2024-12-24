import { User } from "../../../entities/user";

export interface IUserRepository {
  create(
    fullname: string,
    email: string,
    password: string,
    profilePic: string
  ): Promise<User>;

  findUser(email: string): Promise<User | null>;
}
