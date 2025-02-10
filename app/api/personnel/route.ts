import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
    try {
        const data = await request.json()
        const personnel = await prisma.personnel.create({
            data: {
                programId: data.programId,
                employeeId: data.employeeId,
                role: data.role,
                startDate: new Date(),
                assignmentStart: new Date(data.assignmentStart),
                billableRate: Number.parseFloat(data.billableRate),
                clearanceLevel: data.clearanceLevel || "None",
                currentStatus: true,
            },
        })
        return NextResponse.json(personnel)
    } catch (error) {
        console.error("Failed to assign employee:", error)
        return NextResponse.json({ error: "Failed to assign employee" }, { status: 500 })
    }
}

