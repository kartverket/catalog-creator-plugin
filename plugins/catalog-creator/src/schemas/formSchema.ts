import * as z from "zod";

export const formSchema = z.object({
    name: z.string().min(1, "add a name"),
    owner: z.string().min(1, "add an owner"),
    lifecycle: z.enum(["development", "production", "deprecated"]),
    type: z.enum(["service", "website", "library"]),
    system: z.optional(z.string())
})