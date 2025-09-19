import * as z from "zod";

export const formSchema = z.object({
    name: z.string().min(1, "add a name"),
    owner: z.string().min(1, "add an owner"),
    lifecycle: z.enum(["development", "production", "deprecated"], { error: "choose a lifecycle"}),
    type: z.enum(["service", "website", "library"], { error: "choose a type"}),
    system: z.optional(z.string())
})