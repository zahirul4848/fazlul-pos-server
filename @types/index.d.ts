import { Request } from "express";
//import { IUser } from "../models/UserModel";

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: Record<User>;
    }
  }
}