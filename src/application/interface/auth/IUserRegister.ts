import { User } from "../../../entities/user";


export interface IUserRegister {
  create(
    fullname: string,
    email: string,
    password: string,
    profilePic: string,
  ): Promise<User>;

  login(email: string,  password: string): Promise<User | null>;

}


