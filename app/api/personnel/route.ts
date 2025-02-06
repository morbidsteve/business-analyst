import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
    try {
        const data = await request.json()
        const personnel = await prisma.personnel.create({
            data: {
                programId: data.programId,
                employeeId: data.employeeId,
                startDate: new Date(),
            },
        })
        return NextResponse.json(personnel)
    } catch (error) {
        console.error("Failed to add personnel:", error)
        return NextResponse.json({ error: "Failed to add personnel" }, { status: 500 })
    }
}

