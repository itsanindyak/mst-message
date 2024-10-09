import UserModel from "@/model/user.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import { dbConnect } from "@/lib/dbConnect";
import { User } from "next-auth";
import { response } from "@/types/ApiResponse";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return Response.json(new response(401, false, "You must be logged in."), {
      status: 401,
    });
  }

  const userid = new mongoose.Types.ObjectId(session?.user?._id);

  try {
    const user = await UserModel.aggregate([
      { $match: { _id: userid } },
      { $unwind: "$messages" },
      { $sort: { "$messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);
    if (!user || user.length === 0) {
      return Response.json(new response(401, false, "User not found."), {
        status: 401,
      });
    }
    return Response.json(
      new response(200, true, "Message fetched successfully", user[0].messages),
      {
        status: 200,
      }
    );
  } catch (error) {
    return Response.json(new response(500, false, "Error to get message."), {
      status: 500,
    });
  }
}
