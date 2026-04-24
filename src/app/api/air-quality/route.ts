// PATH: app/api/air-quality/route.ts

import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const querySchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const parsed = querySchema.safeParse({
      lat: searchParams.get("lat"),
      lng: searchParams.get("lng"),
    })

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
    }

    const { lat, lng } = parsed.data
    const res = await fetch(
      `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lng}&current=pm10,pm2_5,ozone,nitrogen_dioxide,european_aqi&timezone=auto`,
      { cache: "no-store" }
    )

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to reach air quality service" }, { status: 502 })
    }

    const data = await res.json()
    if (!data.current) {
      return NextResponse.json({ error: "No air quality data for this location" }, { status: 404 })
    }

    return NextResponse.json(data.current)
  } catch (err) {
    console.error("Air quality error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
