import { z } from "zod";

export const campaignFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(80),
  cap: z
    .string()
    .min(1, "Cap is required")
    .refine((v) => !isNaN(Number(v)) && Number(v) > 0, "Must be a positive number"),
  comment: z.string(),
  countries: z.array(z.string()),
  languages: z.array(z.string()),
  partnerId: z.string(),
  brokerId: z.string().min(1, "Broker is required"),
  managerId: z.string(),
  status: z.enum(["ON", "OFF"]),

  checkerFunnel: z.boolean(),
  funnelData: z.string(),
  activeDays: z.array(z.string()),
  timeFrom: z.string(),
  timeTo: z.string(),
  timezone: z.string(),
});

export type CampaignFormValues = z.infer<typeof campaignFormSchema>;
