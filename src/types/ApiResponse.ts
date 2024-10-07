import { Message } from "@/model/message.model";

export interface ApiResponse {
  success: boolean;
  message: string;
  isAccepetingMessage?: boolean;
  messages?: Array<Message>;
}

class response {
    statusCode: number;
    success: boolean;
    message: string;
    data?: object;

    constructor(statusCode: number, success: boolean, message: string = "Success" , data?: object) {
        this.statusCode = statusCode;
        this.success = success;
        this.data = data;
        this.message = message;
    }
}

export { response };

