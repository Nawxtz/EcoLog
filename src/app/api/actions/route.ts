// PATH: app/api/actions/route.ts

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { actionSchema } from "@/schemas/actionSchema"
import { calculateCO2Saved, getUnitForType } from "@/lib/co2Calculator"

export async function GET() {
  try {
    const actions = await prisma.ecoAction.findMany({
      orderBy: { date: "desc" },
    })
    return NextResponse.json(actions)
  } catch (err) {
    console.error("GET /api/actions error:", err)
    return NextResponse.json({ error: "Failed to fetch actions" }, { status: 500 })
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

    const parsed = actionSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
    }

    // Derive unit and co2Saved server-side — never trust the client for these
    const unit = getUnitForType(parsed.data.type)
    const co2Saved = calculateCO2Saved(parsed.data.type, parsed.data.amount)

    const action = await prisma.ecoAction.create({
      data: { ...parsed.data, unit, co2Saved },
    })

    return NextResponse.json(action, { status: 201 })
  } catch (err) {
    console.error("POST /api/actions error:", err)
    return NextResponse.json({ error: "Failed to create action" }, { status: 500 })
  }
}
