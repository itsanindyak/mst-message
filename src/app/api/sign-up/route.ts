import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { ApiResponse } from "@/types/ApiResponse";
import bcrypt from "bcryptjs";
import { NextApiRequest, NextApiResponse } from "next";
import { sendVerifyEmail } from "@/helpers/sendVerifyEmail";

export async function POST(
  request:Request,
  
) {
  await dbConnect();

  try {
   
    
    const { username, email, password } =  await request.json();

    const exsitingVerifiedUserByUsername = await UserModel.findOne({
      username,
      isverified: true,
    });
    
    if (exsitingVerifiedUserByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 400 }
      );
    }
    const existingUserByEmail = await UserModel.findOne({ email });
    const verifycode = Math.floor(100000 + Math.random() * 900000).toString();
    
    
    if (existingUserByEmail) {
      //back
      if (existingUserByEmail.isverified) {
        return Response.json(
          {
            success: false,
            message: "User already exists with this email",
          },
          { status: 400 }
        );
      } else {
        const hashPassword = await bcrypt.hash(password, 10);
        const expiryDate = new Date(Date.now() + 3600000);

        existingUserByEmail.password = hashPassword;
        existingUserByEmail.verifycode = verifycode;
        existingUserByEmail.verifycodeExpiry = expiryDate;

        await existingUserByEmail.save();
      }
    } else {
      //registering new user
      console.log("registering new user");
      
      
      
      const hashPassword = await bcrypt.hash(password, 10);
      console.log("hashed password done !!!!");
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = await UserModel.create({
        username,
        email,
        password: hashPassword,
        verifycode,
        verifycodeExpiry: expiryDate,
        isverified: false,
        isAcceptingMessage: true,
        messages: [],
      });
    }

    // send verification email

    const emailResponce = await sendVerifyEmail(email, username, verifycode);

    if (!emailResponce.success) {
      return Response.json(
        {
          success: false,
          message: emailResponce.message,
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User registered successfully. Please verify your account.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in registering user.", error);
    return Response.json(
      {
        success: false,
        message: "Error registering user",
      },
      { status: 500 }
    );
  }
}
