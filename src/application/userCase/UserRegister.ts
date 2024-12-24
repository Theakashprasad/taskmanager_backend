import { User } from "../../entities/user";
import { HashUtils } from "../../services/HashUtils";
import { IUserRegister } from "../interface/auth/IUserRegister";
import { IUserRepository } from "../interface/auth/IUserRepository";

export class UserRegister implements IUserRegister {
  private _repostitory: IUserRepository;

  //_repostitory help to connect the iuser repository
  constructor(repository: IUserRepository) {
    this._repostitory = repository;
  }

  create = async (
    fullname: string,
    email: string,
    password: string,
    profilePic: string
  ): Promise<User> => {
    try {
      const hashedPassword = await HashUtils.hashPassword(password);
      const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${fullname}`;

      return await this._repostitory.create(
        fullname,
        email,
        hashedPassword,
        (profilePic = boyProfilePic)
      );
    } catch (error) {
      console.error("Error in signup:", error);
      throw error;
    }
  };

  login = async (email: string, password: string): Promise<User | null> => {
    try {
      const response = await this._repostitory.findUser(email);

      if (!response) return null;
      const comparePassword = await HashUtils.comparePassword(
        password,
        response.password
      );

      if (comparePassword) {
        return response;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error in signup:", error);
      throw error;
    }
  };
}
