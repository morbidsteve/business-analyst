import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
    try {
        const data = await request.json()
        const project = await prisma.project.create({
            data: {
                name: data.name,
                description: data.description,
                startDate: new Date(data.startDate),
                endDate: new Date(data.endDate),
                budget: data.budget,
                status: data.status,
                programId: data.programId,
            },
        })

        return NextResponse.json(project)
    } catch (error) {
        console.error("Failed to create project:", error)
        return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
    }
}

