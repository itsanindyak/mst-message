import UserModel from "@/model/user.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import { dbConnect } from "@/lib/dbConnect";
import { User } from "next-auth";
import { response } from "@/types/ApiResponse";

export async function POST(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json(new response(401, false, "You must be logged in."), {
      status: 401,
    });
  }

  const userid = session?.user._id;
  const { acceptMessage } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userid,
      {
        isAcceptingMessage: acceptMessage,
      },
      { new: true }
    );

    if (!updatedUser) {
      return Response.json(new response(400, false, "User not found."), {
        status: 400,
      });
    }

    return Response.json(
      new response(200, true, "User status updated succesfully.", updatedUser),
      {
        status: 200,
      }
    );
  } catch (error) {
    return Response.json(
      new response(
        500,
        false,
        "Failed to updated user status to accept messages."
      ),
      {
        status: 500,
      }
    );
  }
}

export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json(new response(401, false, "You must be logged in."), {
      status: 401,
    });
  }

  const userid = session?.user._id;

  try {
    const user = await UserModel.findById(userid);
    if (!user) {
      return Response.json(new response(400, false, "User not found."), {
        status: 400,
      });
    }

    return Response.json(
      new response(
        200,
        true,
        "User acceptence message status fetched succesfully.",
        { isAcceptingMessage: user.isAcceptingMessage }
      ),
      {
        status: 200,
      }
    );
  } catch (error) {
    return Response.json(
      new response(500, false, "Failed to fetch user status."),
      {
        status: 500,
      }
    );
  }
}
