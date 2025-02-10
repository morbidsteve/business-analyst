import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
    try {
        const data = await request.json()
        const personnelData: any = {
            program: {
                connect: { id: data.programId },
            },
            employee: {
                connect: { id: data.employeeId },
            },
            startDate: new Date(),
            role: data.role,
            assignmentStart: new Date(),
            assignmentEnd: data.assignmentEnd ? new Date(data.assignmentEnd) : null,
            billableRate: data.billableRate,
            clearanceLevel: data.clearanceLevel || "None",
            currentStatus: true,
        }

        if (!data.isPlanning && data.contractId) {
            personnelData.contract = {
                connect: { id: data.contractId },
            }
        }

        if (!data.isPlanning && data.laborCategoryId) {
            personnelData.laborCategory = {
                connect: { id: data.laborCategoryId },
            }
        }

        const personnel = await prisma.personnel.create({
            data: personnelData,
        })
        return NextResponse.json(personnel)
    } catch (error) {
        console.error("Failed to add personnel:", error)
        return NextResponse.json({ error: "Failed to add personnel" }, { status: 500 })
    }
}

