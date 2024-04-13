import mongoose, {Document, Schema} from "mongoose";
import bcryptjs from "bcryptjs";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  resetLink?: string;
  matchPassword: (enterPassword: string) => Promise<boolean>;
}

const userSchema: Schema<IUser> = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    min: 3,
    max: 30,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
    max: 30,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  role: {
    type: String,
    enum: ["USER", "ADMIN"],
    default: "USER",
  },
  resetLink: {
    type: String,
  }
}, {
  timestamps: true,
});

userSchema.pre("save", async function(next) {
  if(!this.isModified("password")) {
    next();
  }
  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);  
})

// userSchema.methods.matchPassword = async function(enterPassword: string) {
//   console.log(this.password);
//   return await bcryptjs.compare(enterPassword, this.password);
// };

userSchema.methods.matchPassword = async function(enteredPassword: string): Promise<boolean> {
  return await bcryptjs.compare(enteredPassword, this.password);
}


export default mongoose.model("User", userSchema);