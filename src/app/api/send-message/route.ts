import { dbConnect } from "@/lib/dbConnect";
import { Message } from "@/model/message.model";
import UserModel from "@/model/user.model";
import { response } from "@/types/ApiResponse";


export async function POST(request:Request) {
    await dbConnect();

    const {username,content} = await request.json();


    try {

        const user = await UserModel.findOne({username}) ;
        if (!user) {
            return Response.json(new response(400, false, "User not found."), {
                status: 400,
            });
        }
        if (!user.isAcceptingMessage) {
            return Response.json(new response(403, false, "User is not accept message."), {
                status: 403,
            });
        }

        const newMessage = {content,createdAt:new Date()};


        user.messages.push(newMessage as Message)
        await user.save()

        return Response.json(new response(200, true, "Message send successfully."), {
            status: 200,
        });
        
    } catch (error) {
        return Response.json(new response(500, false, "Error to send message."), {
            status: 500,
        });
    }
}
