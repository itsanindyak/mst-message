import { dbConnect } from "@/lib/dbConnect";
import { Message } from "@/model/message.model";
import UserModel from "@/model/user.model";
import { response } from "@/types/ApiResponse";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";

export async function DELETE(request: Request) {
  await dbConnect();

  const { messageId } = await request.json();

  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return Response.json(new response(400, false, "User not logged in."));
  }
  const user: User = session?.user as User;
  try {
    const updateResult = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: messageId } } }
    );

    if (updateResult.modifiedCount === 0) {
      return Response.json(
        { message: "Message not found or already deleted", success: false },
        { status: 404 }
      );
    }

    return Response.json(
      { message: "Message deleted", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting message:", error);
    return Response.json(
      { message: "Error deleting message", success: false },
      { status: 500 }
    );
  }
}
