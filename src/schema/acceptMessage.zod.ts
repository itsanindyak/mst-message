import { z } from "zod";

export const accceptMessageSchema = z.object({
  accceptMessage: z.boolean()
});
