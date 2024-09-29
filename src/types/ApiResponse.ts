import {Message} from "@/model/message.model"

export interface ApiResponce{
    success:boolean;
    message:string;
    isAccepetingMessage?:boolean;
    messages?:Array<Message>;
}