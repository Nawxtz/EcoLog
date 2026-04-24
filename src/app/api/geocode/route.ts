// PATH: app/api/geocode/route.ts

import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const querySchema = z.object({
  name: z.string().min(2, "Search term must be at least 2 characters").max(100),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const parsed = querySchema.safeParse({ name: searchParams.get("name") })

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(parsed.data.name)}&count=5&language=en&format=json`,
      { cache: "no-store" }
    )

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to reach geocoding service" }, { status: 502 })
    }

    const data = await res.json()
    return NextResponse.json(data.results ?? [])
  } catch (err) {
    console.error("Geocode error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
