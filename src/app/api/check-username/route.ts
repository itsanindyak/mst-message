import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { z } from "zod";
import { usernameValidation } from "@/schema/signup.zod";
import { response } from "@/types/ApiResponse";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const queryUsername = {
      username: searchParams.get("username"),
    };
    //username validation using zod

    const result = UsernameQuerySchema.safeParse(queryUsername);

    if (!result.success) {
      const usernameError = result.error.format().username?._errors || [];
      return Response.json(
        new response(400, result.success, result.error?.errors[0].message),
        { status: 400 }
      );
    }

    const { username } = result.data;

    const exsitingVerifiedUserByUsername = await UserModel.findOne({
      username,
      isverified: true,
    });

    if (exsitingVerifiedUserByUsername) {
      return Response.json(
        new response(400, false, "Username is already taken"),
        { status: 400 }
      );
    }

    return Response.json(new response(400, true, "Username is unique"), {
      status: 200,
    });
  } catch (error) {
    console.error("Error checking username", error);
    return Response.json(
      new response(500, false, "Error in checking username"),
      { status: 500 }
    );
  }
}
