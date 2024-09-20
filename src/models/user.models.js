import mongoose, {Schema} from "mongoose"
import bcrypt from "bcrypt"
import {jwt } from "jsonwebtoken"
const userSchema = new Schema ({

    name: {
        type: String,
        required: true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        toLowerCase: true
   },
   username:{
    type:String,
    required:true,
    unique:true,
},
   phone:{
    type:String,
    required:true,
    unique:true,
    },
    password:{
        type:String,
        required:true,
    }
   
},{timestamps: true})

userSchema.pre("save", async function (next) {
  if (!this.password === isModified) {
    return next();
  }
  const hashPassword = await bcrypt.hash(password, 10);
  return hashPassword;
});

userSchema.methods.isPasswordCorrect = async function (password) {
  bcrypt.compare(this.password, password);
};

userSchema.methods.generateAccessToken = function () {
  const accessToken = jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      phone: this.phone,
      address: this.address,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
  return accessToken;
};

userSchema.methods.generateRefreshToken = function () {
  const refreshToken = jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
  return refreshToken;
};


export const User = mongoose.model("User", userSchema)