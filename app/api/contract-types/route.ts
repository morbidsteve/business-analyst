import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
    try {
        const contractTypes = await prisma.contractType.findMany({
            select: {
                id: true,
                name: true,
            },
            orderBy: {
                name: "asc",
            },
        })
        return NextResponse.json(contractTypes)
    } catch (error) {
        console.error("Failed to fetch contract types:", error)
        return NextResponse.json({ error: "Failed to fetch contract types" }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json()
        const contractType = await prisma.contractType.create({
            data: {
                name: data.name,
                category: data.category || "Other",
                billingRequirements: data.billingRequirements || "Standard",
            },
        })
        return NextResponse.json(contractType)
    } catch (error) {
        console.error("Failed to create contract type:", error)
        return NextResponse.json({ error: "Failed to create contract type" }, { status: 500 })
    }
}

