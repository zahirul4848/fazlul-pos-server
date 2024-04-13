import jwt, { Secret } from "jsonwebtoken";

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export const generateToken = (user: User)=> {
  const payload = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
  const token = jwt.sign(
    payload, 
    process.env.ACCESS_TOKEN_PRIVATE_KEY as Secret,
    {expiresIn: "30d"}
  );
  return token;
}
