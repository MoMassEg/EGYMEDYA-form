import { z } from "zod";
export const submissionSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name.").max(100),
  phone: z.string().trim().regex(/^\+?[0-9 ()-]{7,20}$/, "Enter a valid phone number."),
  instagram: z.string().trim().regex(/^@?[a-zA-Z0-9._]{2,30}$/, "Enter a valid Instagram username."),
  email: z.string().trim().email("Enter a valid email address.").max(160),
  website: z.string().max(0).optional(),
});
export type SubmissionInput = z.infer<typeof submissionSchema>;