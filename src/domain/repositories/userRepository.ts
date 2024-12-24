import { IUserRepository } from "../../application/interface/auth/IUserRepository";
import { User } from "../../entities/user";
import UserModel from "../model/userModel";

export class UserRepository implements IUserRepository {
  create = async (
    fullname: string,
    email: string,
    password: string,
    profilePic: string
  ): Promise<User> => {
    try {

      const user = {
        fullname,
        email,
        password,
        profilePic,
      };
      const newuser = await UserModel.create(user);
      console.log(newuser, "created");
      return newuser;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };

  findUser = async (email: string): Promise<User | null> => {
    try {
      const newuser = await UserModel.findOne({ email });
      return newuser;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };


}
