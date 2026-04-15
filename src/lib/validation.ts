import { z } from "zod";

export const CONTACT_METHODS = [
  "Text",
  "Call",
  "Email",
  "Instagram DM",
] as const;

export const INTENTS = [
  "Buy a home",
  "Sell a property",
  "Relocate to or from Southwest Florida",
  "Purchase an investment property",
  "Other",
] as const;

export const leadSchema = z.object({
  first_name: z.string().trim().min(1, "First name is required"),
  last_name: z.string().trim().min(1, "Last name is required"),
  phone: z.string().trim().min(1, "Phone number is required"),
  email: z.string().trim().email("Please enter a valid email"),
  instagram: z.string().trim().min(1, "Instagram handle is required"),
  contact_method: z.enum(CONTACT_METHODS),
  intent: z.enum(INTENTS).optional(),
  message: z.string().trim().min(1, "Message is required"),
});

export type LeadInput = z.infer<typeof leadSchema>;
