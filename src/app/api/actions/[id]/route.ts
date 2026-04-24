// PATH: app/api/actions/[id]/route.ts

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { actionSchema } from "@/schemas/actionSchema"
import { calculateCO2Saved, getUnitForType } from "@/lib/co2Calculator"
import { Prisma } from "@prisma/client"

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    if (isNaN(id) || id <= 0) {
      return NextResponse.json({ error: "Invalid action ID" }, { status: 400 })
    }

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

    // Recalculate unit and co2Saved server-side on every update
    const unit = getUnitForType(parsed.data.type)
    const co2Saved = calculateCO2Saved(parsed.data.type, parsed.data.amount)

    const updated = await prisma.ecoAction.update({
      where: { id },
      data: { ...parsed.data, unit, co2Saved },
    })

    return NextResponse.json(updated)
  } catch (err) {
    // Type-safe Prisma error handling — no err: any
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
        return NextResponse.json({ error: "Action not found" }, { status: 404 })
      }
    }
    console.error("PUT /api/actions/[id] error:", err)
    return NextResponse.json({ error: "Failed to update action" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    if (isNaN(id) || id <= 0) {
      return NextResponse.json({ error: "Invalid action ID" }, { status: 400 })
    }

    await prisma.ecoAction.delete({ where: { id } })
    return NextResponse.json({ success: true })

  } catch (err) {
    // Type-safe Prisma error handling — no err: any
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
        return NextResponse.json({ error: "Action not found" }, { status: 404 })
      }
    }
    console.error("DELETE /api/actions/[id] error:", err)
    return NextResponse.json({ error: "Failed to delete action" }, { status: 500 })
  }
}
