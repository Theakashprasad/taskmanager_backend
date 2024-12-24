import { Response, Request, NextFunction } from "express";
import { ResponseStatus } from "../../services/ResponseStatus";
import { User } from "../../entities/user";
import { UserRegister } from "../../application/userCase/UserRegister";
import { JwtUtils } from "../../services/JwtUtils";

export class AuthController {
  private _register: UserRegister;
  private userdatas!: User;

  //the interactor help to access the user interface repository
  constructor(register: UserRegister) {
    this._register = register;
  }

  //SIGN UP
  onSignup = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { fullname, email, password } = req.body.data;
      const profilePic = "";
      const data = await this._register.create(
        fullname,
        email,
        password,
        profilePic
      );

      res.status(ResponseStatus.OK).json({ message: fullname });
    } catch (error) {
      res.status(ResponseStatus.BadRequest).json(error);
      return;
    }
  };

  onLogin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    let { email, password } = req.body.data;
    try {
      const data = await this._register.login(email, password);

      const JWTtoken = await JwtUtils.generateToken(data);
      console.log("asfd", JWTtoken);

      const expiryDate = new Date(Date.now() + 3600000); // 1 hour
      console.log("data", data);

      res
        .cookie("access_token", JWTtoken, {
          expires: expiryDate,
          httpOnly: true, // Ensures it’s not accessible via JS
          secure: process.env.NODE_ENV === "production", // Only use secure cookies in production
        })
        .status(200)
        .json({ data, success: true, token: JWTtoken });
    } catch (error) {
      res.status(ResponseStatus.BadRequest).json(error);
    }
  };
}
