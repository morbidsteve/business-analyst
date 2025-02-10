import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const programId = searchParams.get("programId")

    if (!programId) {
        return NextResponse.json({ error: "Program ID is required" }, { status: 400 })
    }

    try {
        const financialData = await prisma.financialData.findMany({
            where: { programId: programId },
            orderBy: { date: "desc" },
        })
        return NextResponse.json(financialData)
    } catch (error) {
        console.error("Failed to fetch financial data:", error)
        return NextResponse.json({ error: "Failed to fetch financial data" }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json()
        const financialData = await prisma.financialData.create({
            data: {
                type: data.type,
                amount: data.amount,
                date: new Date(data.date),
                description: data.description,
                program: { connect: { id: data.programId } },
            },
        })
        return NextResponse.json(financialData)
    } catch (error) {
        console.error("Failed to create financial data:", error)
        return NextResponse.json({ error: "Failed to create financial data" }, { status: 500 })
    }
}

