import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { response } from "@/types/ApiResponse";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, code } = await request.json();
    const user = await UserModel.findOne({ username });
    if (!user) {
      return Response.json(new response(400, false, "User not exist."), {
        status: 400,
      });
    }

    const isCodeValid = user.verifycode === code;
    const isCodeNotExpired = new Date() < new Date(user.verifycodeExpiry);

    if (!isCodeNotExpired) {
      return Response.json(
        new response(400, false, "Verify code is expired."),
        { status: 400 }
      );
    } else {
      if (!isCodeValid) {
        return Response.json(
          new response(400, false, "Verify code is invalid"),
          { status: 400 }
        );
      } else {
        user.isverified = true;
        await user.save();
        return Response.json(
          new response(201, true, "Account verify succesfully."),
          { status: 201 }
        );
      }
    }
  } catch (error) {
    console.error("Error verifying user.", error);
    return Response.json(new response(500, false, "Error verifying user."), {
      status: 500,
    });
  }
}
