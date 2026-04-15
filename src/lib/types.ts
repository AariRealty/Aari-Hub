export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "closed_won"
  | "closed_lost";

export type ContactMethod = "Text" | "Call" | "Email" | "Instagram DM";

export type Intent =
  | "Buy a home"
  | "Sell a property"
  | "Relocate to or from Southwest Florida"
  | "Purchase an investment property"
  | "Other";

export type Lead = {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  instagram_handle: string;
  contact_method: ContactMethod;
  intent: Intent | null;
  message: string;
  status: LeadStatus;
  notes: string | null;
  follow_up_at: string | null;
};
