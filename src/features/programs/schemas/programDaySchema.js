import { z } from "zod";

export const programDaySchema = z.object({
  name: z.string().trim().min(1, "Program Day name is required"),

  description: z.string(),
});
