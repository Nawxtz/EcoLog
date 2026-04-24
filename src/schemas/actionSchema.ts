import { z } from "zod"

export const actionSchema = z.object({
  type: z.enum(
    ["walking", "cycling", "public_transport", "plant_based_meal", "recycling", "home_energy"],
    { errorMap: () => ({ message: "Please select a valid action type" }) }
  ),
  description: z
    .string()
    .min(3, "Description must be at least 3 characters")
    .max(200, "Description is too long")
    .trim(),
  amount: z.coerce
    .number({ invalid_type_error: "Amount must be a number" })
    .positive("Amount must be greater than 0")
    .max(10000, "Amount seems too large"),
  date: z.string().date("Must be a valid date in YYYY-MM-DD format"),
})

// Note: 'unit' is intentionally NOT in this schema — derived server-side only
export type ActionInput = z.infer<typeof actionSchema>