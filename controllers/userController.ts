import expressAsync from "express-async-handler";
import jwt, { Secret } from "jsonwebtoken";
import { generateToken } from "../utils/generateToken";
import UserModel from "../models/UserModel";
import { emailTamplateForgotPassword, mg } from "../utils/mailgun";
import { validateEmail } from "../utils/validateEmail";
import { Request, Response } from "express";


// create new user // api/user // post    // not protected
export const registerUser = expressAsync(async(req: Request, res: Response)=> {
  const {name, email, password}: {name: string; email: string; password: string} = req.body;
  const userExists = await UserModel.findOne({email});
  if(!userExists && validateEmail(email)) {
    try {
      const user = await UserModel.create({name, email, password});
      const token = generateToken(user);
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      });
    } catch (err: any) {
      res.status(400);
      throw new Error(err.message);
    }
  } else {
    res.status(400);
    throw new Error("User already exists with this email");
  }
});

// login user // api/user/login // post  // not protected
export const loginUser = expressAsync(async(req: Request, res: Response)=> {
  const {email, password}: {email: string; password: string} = req.body;
  const user = await UserModel.findOne({email}).select("+password");
  if(user && (await user.matchPassword(password))) {
    const token = generateToken(user);
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } else {
    res.status(401);
    throw new Error("Invalid user or password");
  }
});

// forgot password // api/user/forgotpassword // put  // not protected
export const forgotPassword = expressAsync(async(req: Request, res: Response)=> {
  const email: string = req.body.email;
  const user = await UserModel.findOne({email});
  if(user) {
    const token = generateToken(user);
    const messageData = {
      from: "TrendPeak <johirul016@gmail.com>",
      to: user.email,
      subject: "Password Reset Link",
      html: emailTamplateForgotPassword(user.name, token),
    }
    await user.updateOne({resetLink: token});
    mg.messages.create(
      process.env.MAILGUN_DOMAIN as string, 
      messageData
    ).then(msg => {
      //console.log(msg)
      res.status(200).json({message: 'Email has been sent to your email address, please check your email, if you do not get email please check your junk folder'});
    }
    ).catch(err => {
      res.status(400);
      throw new Error(err.message || err.error);
    }
    );
  } else {
    res.status(401);
    throw new Error("Invalid Email");
  }
});

// forgot password // api/user/forgotpassword // put  // not protected
type ResetPasswordRequest = {
  token: string;
  password: string;
}

export const resetPassword = expressAsync(async(req: Request, res: Response)=> {
  const {password, token} = req.body as ResetPasswordRequest;
  if(token && password) {
    jwt.verify(token, process.env.ACCESS_TOKEN_PRIVATE_KEY as Secret, async(err, decode)=> {
      if(err) {
        res.status(401);
        throw new Error("Invalid or expired token");
      } else {
        const user = await UserModel.findOne({resetLink: token});
        if(user) {
          user.password = password;
          user.resetLink = "";
          await user.save();

          const messageData = {
            from: "TrendPeak <johirul016@gmail.com>",
            to: user.email,
            subject: "Password Reset Successful",
            text: 'Your password has been reset successfully.',
          }
          mg.messages.create(
            process.env.MAILGUN_DOMAIN as string, 
            messageData
          ).then(msg => {
            //console.log(msg)
            res.status(200).json({message: 'Password Reset Successful'});
          }
          ).catch(err => {
            res.status(401);
            throw new Error(err.message || err.error);
          }
          );

        } else {
          res.status(401);
          throw new Error("User Not Found");
        }
      }
    })
  } else {
    res.status(401);
    throw new Error("No reset link or password Found");
  }
});

// edit user profile // api/user/profile // put // protected by user
export const updateUserProfile = expressAsync(async(req: Request, res: Response)=> {
  const user = await UserModel.findById(req.user?._id);
  if(user) {
    user.name = req.body.name || user.name;
    if(validateEmail(req.body.email)) {
      user.email = req.body.email;
    }
    if(req.body.password) {
      user.password = req.body.password;
    }
    const updatedUser = await user.save();
    const token = generateToken(updatedUser);
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      token,
    });
  } else {
    res.status(401);
    throw new Error("User not found");
  }
});


// get user profile // api/user/profile // get  // protected by user
export const getUserProfile = expressAsync(async(req: Request, res: Response)=> {
  try {
    const user = await UserModel.findById(req.user?._id).select("-password");
    res.status(200).json(user);
  } catch (err: any) {
    res.status(401);
    throw new Error(err.message);
  }
});

// get all users // api/user // get  // protected by admin
export const getAllUsers = expressAsync(async(req: Request, res: Response)=> {
  const name = req.query.name || "";
  const nameFilter = name ? {name: {$regex: name, $options: "i"}} : {};
  try {
    const users = await UserModel.find({...nameFilter}).select("-password");
    res.status(200).json(users);
  } catch (err: any) {
    res.status(401);
    throw new Error(err.message);
  }
});

// delete user by id // api/user/:id // delete  // protected by admin
export const deleteUser = expressAsync(async(req: Request, res: Response)=> {
  try {
    if(req.user?._id == req.params.id) {
      res.status(500);
      throw new Error("You can not delete your user");
    } else {
      await UserModel.findByIdAndDelete(req.params.id);
      res.status(200).json({message: "User deleted successfully"});
    }
  } catch (err: any) {
    res.status(401);
    throw new Error(err.message);
  }
});
