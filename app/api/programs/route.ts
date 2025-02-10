import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
    try {
        const programs = await prisma.program.findMany({
            select: {
                id: true,
                name: true,
            },
            orderBy: {
                name: "asc",
            },
        })
        return NextResponse.json(programs)
    } catch (error) {
        console.error("Failed to fetch programs:", error)
        return NextResponse.json({ error: "Failed to fetch programs" }, { status: 500 })
    }
}

