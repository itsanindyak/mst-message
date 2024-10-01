import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { ApiResponce } from "@/types/ApiResponse";
import bcrypt from "bcryptjs";
import { NextApiRequest, NextApiResponse } from "next";
import { sendVerifyEmail } from "@/helpers/sendVerifyEmail";

export async function POST(
  request: NextApiRequest,
  responce: NextApiResponse<ApiResponce>
) {
  await dbConnect();

  try {
    const { username, email, password } = await request.body;

    const exsitingVerifiedUserByUsername = await UserModel.findOne({
      username,
      isverified: true,
    });

    if (exsitingVerifiedUserByUsername) {
      return responce
        .status(400)
        .json({ success: false, message: "Username is already taken" });
    }
    const existingUserByEmail = await UserModel.findOne({ email });
    const verifycode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      //back
      if(existingUserByEmail.isverified){
        return responce
        .status(500)
        .json({ success: false, message: "User alreadt exist." });
      }
      else{
        const hashPassword= await bcrypt.hash(password,10)
        const expiryDate = new Date(Date.now()+3600000)

        existingUserByEmail.password=hashPassword
        existingUserByEmail.verifycode=verifycode
        existingUserByEmail.verifycodeExpiry=expiryDate

        await existingUserByEmail.save()
      }

    } else {
      //registering new user

      const hashPassword = await bcrypt.hash(password, 10);
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
      return responce
        .status(500)
        .json({ success: false, message: emailResponce.message });
    }

    return responce
        .status(200)
        .json({ success: true, message: "User register successfully.Please verify your email." });


  } catch (error) {
    console.error("Error in registering user.", error);
    return responce
      .status(500)
      .json({ success: false, message: "Failed to registering new user" });
  }
}
