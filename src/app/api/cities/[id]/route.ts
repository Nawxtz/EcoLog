// PATH: app/api/cities/[id]/route.ts

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    if (isNaN(id) || id <= 0) {
      return NextResponse.json({ error: "Invalid city ID" }, { status: 400 })
    }

    await prisma.savedCity.delete({ where: { id } })
    return NextResponse.json({ success: true })

  } catch (err) {
    // Type-safe Prisma error handling — no err: any
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
        return NextResponse.json({ error: "City not found" }, { status: 404 })
      }
    }
    console.error("DELETE /api/cities/[id] error:", err)
    return NextResponse.json({ error: "Failed to delete city" }, { status: 500 })
  }
}
