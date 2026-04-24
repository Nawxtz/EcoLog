import { z } from "zod"

export const citySchema = z.object({
  name: z.string().min(1, "City name is required").max(100),
  country: z.string().min(1, "Country is required").max(100),
  countryCode: z.string().length(2, "Country code must be 2 characters"),
  latitude: z.coerce.number().min(-90, "Latitude must be ≥ -90").max(90, "Latitude must be ≤ 90"),
  longitude: z.coerce.number().min(-180, "Longitude must be ≥ -180").max(180, "Longitude must be ≤ 180"),
})

export type CityInput = z.infer<typeof citySchema>