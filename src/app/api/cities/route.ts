// PATH: app/api/cities/route.ts

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { citySchema } from "@/schemas/citySchema"
import { Prisma } from "@prisma/client"

export async function GET() {
  try {
    const cities = await prisma.savedCity.findMany({
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(cities)
  } catch (err) {
    console.error("GET /api/cities error:", err)
    return NextResponse.json({ error: "Failed to fetch cities" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
    }

    const parsed = citySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
    }

    const city = await prisma.savedCity.create({ data: parsed.data })
    return NextResponse.json(city, { status: 201 })

  } catch (err) {
    // Type-safe Prisma error handling — no err: any
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        return NextResponse.json(
          { error: "This city is already saved to your dashboard" },
          { status: 409 }
        )
      }
    }
    console.error("POST /api/cities error:", err)
    return NextResponse.json({ error: "Failed to save city" }, { status: 500 })
  }
}
