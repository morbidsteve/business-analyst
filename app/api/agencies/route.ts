import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
    try {
        const agencies = await prisma.agency.findMany({
            select: {
                id: true,
                name: true,
            },
            orderBy: {
                name: "asc",
            },
        })
        return NextResponse.json(agencies)
    } catch (error) {
        console.error("Failed to fetch agencies:", error)
        return NextResponse.json({ error: "Failed to fetch agencies" }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json()
        const agency = await prisma.agency.create({
            data: {
                name: data.name,
                department: data.department || "Unknown",
                address: data.address || "Unknown",
                paymentOffice: data.paymentOffice || "Unknown",
            },
        })
        return NextResponse.json(agency)
    } catch (error) {
        console.error("Failed to create agency:", error)
        return NextResponse.json({ error: "Failed to create agency" }, { status: 500 })
    }
}

