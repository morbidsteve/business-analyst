import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const contractId = searchParams.get("contractId")

    if (!contractId) {
        return NextResponse.json({ error: "Contract ID is required" }, { status: 400 })
    }

    try {
        const laborCategories = await prisma.laborCategory.findMany({
            where: { contractId: contractId },
            select: {
                id: true,
                title: true,
            },
        })
        return NextResponse.json(laborCategories)
    } catch (error) {
        console.error("Failed to fetch labor categories:", error)
        return NextResponse.json({ error: "Failed to fetch labor categories" }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json()
        const laborCategory = await prisma.laborCategory.create({
            data: {
                title: data.title,
                description: data.description,
                minRate: data.minRate,
                maxRate: data.maxRate,
                educationReq: data.educationReq,
                experienceReq: data.experienceReq,
                clearanceReq: data.clearanceReq,
                active: data.active,
                contract: {
                    connect: { id: data.contractId },
                },
            },
        })
        return NextResponse.json(laborCategory)
    } catch (error) {
        console.error("Failed to create labor category:", error)
        return NextResponse.json({ error: "Failed to create labor category" }, { status: 500 })
    }
}

