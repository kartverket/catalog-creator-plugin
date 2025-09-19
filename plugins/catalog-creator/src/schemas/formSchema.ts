import * as z from "zod";

export const formSchema = z.object({
    name: z.string().trim().min(1, "Add a name").refine(s => !s.includes(' '), { message: "Name cannot contain space"}).refine(s => !/[.!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]$/.test(s), 
    'Name cannot end with special characters'),
    owner: z.string().trim().min(1, "Add an owner").refine(s => !s.includes(' '), { message: "Owner cannot contain space"}),
    lifecycle: z.enum(["development", "production", "deprecated"], { error: "Choose a lifecycle"}),
    type: z.enum(["service", "website", "library"], { error: "Choose a type"}),
    system: z.optional(z.string().trim().refine(s => !s.includes(' '), { message: "System cannot contain space"}))
})