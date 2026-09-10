import { z } from "zod";
export const submissionSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name.").max(100),
  phone: z.string().trim().regex(/^\+?[0-9 ()-]{7,20}$/, "Enter a valid phone number."),
  instagram: z.string().trim().regex(/^@?[a-zA-Z0-9._]{2,30}$/, "Enter a valid username.").optional().or(z.literal("")),
  linkedin: z.string().trim().url("Enter a valid LinkedIn URL.").refine((value) => value === "" || value.includes("linkedin.com/"), "Enter a valid LinkedIn URL.").optional().or(z.literal("")),
  email: z.string().trim().email("Enter a valid email address.").max(160),
  interests: z.array(z.string().trim().max(120)).max(10).optional().default([]),
  otherDetails: z.string().max(120).optional(),
  website: z.string().max(0).optional(),
});
export type SubmissionInput = z.infer<typeof submissionSchema>;