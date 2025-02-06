import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
    try {
        const laborCosts = await prisma.laborCost.findMany({
            where: { deletedAt: null },
            include: { employee: true, program: true },
        })
        return NextResponse.json(laborCosts)
    } catch (error) {
        console.error("Failed to fetch labor costs:", error)
        return NextResponse.json({ error: "Failed to fetch labor costs" }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json()
        const laborCost = await prisma.laborCost.create({
            data: {
                programId: data.programId,
                employeeId: data.employeeId,
                personnelId: data.personnelId,
                hours: Number.parseFloat(data.hours),
                date: new Date(data.date),
            },
        })
        return NextResponse.json(laborCost)
    } catch (error) {
        console.error("Failed to create labor cost:", error)
        return NextResponse.json({ error: "Failed to create labor cost" }, { status: 500 })
    }
}

